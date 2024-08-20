<template>
  <div class="main-container">
    <div class="left-container">
      <div class="schedule-container">
        <div class="filters">
          <select v-model="selectedDate" @change="applyFilters" class="filter-item">
            <option value="">모든 날짜</option>
            <option v-for="date in uniqueDates" :key="date" :value="date">{{ formatDate(date) }}</option>
          </select>
          <select v-model="selectedTeam" @change="applyFilters" class="filter-item">
            <option value="">모든 팀</option>
            <option v-for="team in teams" :key="team.teamId" :value="team.teamName">{{ team.teamName }}</option>
          </select>
          <select v-model="selectedStadium" @change="applyFilters" class="filter-item">
            <option value="">모든 구장</option>
            <option v-for="stadium in stadiums" :key="stadium.stadiumId" :value="stadium.stadiumName">{{ stadium.stadiumName }}</option>
          </select>
        </div>

        <table class="games-table">
          <thead>
          <tr>
            <th>날짜</th>
            <th>시간</th>
            <th>홈팀</th>
            <th>원정팀</th>
            <th class="fixed-width">구장</th>
            <th>예매</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="game in paginatedGames" :key="game.gameId">
            <td>{{ formatDate(game.gameDate) }}</td>
            <td>{{ formatTime(game.gameTime) }}</td>
            <td>{{ game.homeTeamName }}</td>
            <td>{{ game.awayTeamName }}</td>
            <td class="fixed-width">{{ game.stadiumName }}</td>
            <td>
              <button
                  class="book-button"
                  :disabled="game.sellable !== 'S'"
                  @click="goToBookingPage(game.gameId)"
              >
                {{ game.sellable === 'S' ? '예매하기' : '예매불가' }}
              </button>
            </td>
          </tr>
          </tbody>
        </table>

        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 0" class="pagination-button">이전</button>
          <span class="page-info">{{ currentPage + 1 }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage >= totalPages - 1" class="pagination-button">다음</button>
        </div>
      </div>
    </div>
    <div class="right-container">
      <div class="user-info">
        <h3 class="user-name">{{ user.name }}님, 환영합니다!</h3>
        <p class="user-email">{{ user.email }}</p>
        <div class="recent-booking">
          <h4>최근 예매 내역</h4>
          <p v-if="user.recentBooking">{{ user.recentBooking }}</p>
          <p v-else>최근 예매 내역이 없습니다.</p>
        </div>
        <button @click="logout" class="auth-button">로그아웃</button>
      </div>
      <div class="team-rankings">
        <table class="ranking-table">
          <thead>
          <tr>
            <th>순위</th>
            <th>팀 로고</th>
            <th>팀명</th>
            <th>게임차</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="rank in teamRanks" :key="rank.teamRankId">
            <td>{{ rank.teamRank }}</td>
            <td>
              <img :src="teamLogos[rank.teamId]" alt="팀 로고" class="team-logo" />
            </td>
            <td>{{ rank.teamName }}</td>
            <td>{{ rank.gamesBehind }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import router from "@/router/router.js";

export default {
  setup() {
    const games = ref([]);
    const filteredGames = ref([]);
    const teamRanks = ref([]);
    const teamLogos = ref({});
    const teams = ref([
      {teamId: 1, teamName: 'KIA'},
      {teamId: 2, teamName: '두산'},
      {teamId: 3, teamName: 'LG'},
      {teamId: 4, teamName: '삼성'},
      {teamId: 5, teamName: '키움'},
      {teamId: 6, teamName: 'SSG'},
      {teamId: 7, teamName: '한화'},
      {teamId: 8, teamName: '롯데'},
      {teamId: 9, teamName: 'KT'},
      {teamId: 10, teamName: 'NC'}
    ]);

    const stadiums = ref([
      {stadiumId: 1, stadiumName: '이글스파크'},
      {stadiumId: 2, stadiumName: '사직야구장'},
      {stadiumId: 3, stadiumName: 'KT위즈파크'},
      {stadiumId: 4, stadiumName: '잠실야구장'},
      {stadiumId: 5, stadiumName: '창원NC파크'},
      {stadiumId: 6, stadiumName: '랜더스필드'},
      {stadiumId: 7, stadiumName: '챔피언스필드'},
      {stadiumId: 8, stadiumName: '대구삼성라이온즈파크'},
      {stadiumId: 9, stadiumName: '고척스카이돔'}
    ]);
    const selectedDate = ref('');
    const selectedTeam = ref('');
    const selectedStadium = ref('');
    const currentPage = ref(0);
    const pageSize = 5;

    const user = ref({
      name: '홍길동',
      email: 'hong@example.com',
      recentBooking: '2023-08-20 LG vs 두산'
    });

    const uniqueDates = computed(() => {
      if (games.value.length === 0) return [];
      const dates = games.value.map(game => game.gameDate);
      return [...new Set(dates)];
    });

    const totalPages = computed(() => Math.ceil(filteredGames.value.length / pageSize));

    const paginatedGames = computed(() => {
      const start = currentPage.value * pageSize;
      return filteredGames.value.slice(start, start + pageSize);
    });

    const fetchGames = async () => {
      try {
        const response = await axios.get('/api/game/all');
        games.value = response.data.sort((a, b) => new Date(a.gameDate) - new Date(b.gameDate));
        applyFilters();
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    const fetchTeamRanks = async () => {
      try {
        const response = await axios.get('/api/ranking/all');
        teamRanks.value = response.data;

        for (let rank of teamRanks.value) {
          const logoResponse = await axios.get(
              `/api/teams/logo/${rank.teamId}`
          );
          teamLogos.value[rank.teamId] = logoResponse.data;
        }
      } catch (error) {
        console.error('Error fetching team ranks:', error);
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/profile`);
        let profile = response.data;
        user.value.name = profile.memberName;
        user.value.email = profile.memberEmail;
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const applyFilters = () => {
      currentPage.value = 0;
      filteredGames.value = games.value.filter((game) => {
        const dateMatch = !selectedDate.value || game.gameDate === selectedDate.value;
        const teamMatch = !selectedTeam.value || game.homeTeamName === selectedTeam.value || game.awayTeamName === selectedTeam.value;
        const stadiumMatch = !selectedStadium.value || game.stadiumName === selectedStadium.value;
        return dateMatch && teamMatch && stadiumMatch;
      });
    };

    const prevPage = () => {
      if (currentPage.value > 0) {
        currentPage.value--;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value - 1) {
        currentPage.value++;
      }
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formatTime = (time) => time.slice(0, 5);
    const getTeamName = (teamId) => {
      const team = teams.value.find((t) => t.teamId === teamId);
      return team ? team.teamName : `팀 ${teamId}`;
    };

    const goToBookingPage = (gameId) => {
      router.push({ name: 'TicketBookingView', params: { gameId } });
    };

    const logout = async () => {
      console.log('로그아웃');
      // 로그아웃 로직 구현
      let url = `/api/logout`;
      const response = await axios.post(url, {});
    };

    onMounted(() => {
      fetchGames();
      fetchTeamRanks();
      fetchProfile();
    });

    return {
      games,
      teamRanks,
      teamLogos,
      teams,
      stadiums,
      selectedDate,
      selectedTeam,
      selectedStadium,
      uniqueDates,
      paginatedGames,
      currentPage,
      totalPages,
      prevPage,
      nextPage,
      formatDate,
      formatTime,
      getTeamName,
      goToBookingPage,
      logout,
      applyFilters,
      user,
    };
  },
};
</script>

<style scoped>
.main-container {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 2rem;
  min-height: 80vh;
}

.left-container {
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.schedule-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.right-container {
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.section-title {
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}

.filters {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-item {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.games-table, .ranking-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.games-table th, .games-table td,
.ranking-table th, .ranking-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.games-table th, .ranking-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.games-table .fixed-width {
  width: 150px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.pagination-button {
  padding: 0.5rem 1rem;
  background-color: #1A237E;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.page-info {
  margin: 0 1rem;
}

.auth-button {
  padding: 0.75rem;
  background-color: #B6D6F2;
  color: #011640;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.auth-button:hover {
  background-color: #1A237E;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 호버 시 그림자 추가 */
}

.book-button {
  padding: 0.5rem 1rem;
  background-color: #B6D6F2;
  color: #011640;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.book-button:hover {
  background-color:  #1A237E;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* hover 시 그림자 추가 */
}

.book-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.team-logo {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.user-info {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.user-email, .user-points, .user-favorite-team {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.recent-booking {
  margin-top: 1rem;
  border-top: 1px solid #ddd;
  padding-top: 1rem;
}

.recent-booking h4 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
</style>