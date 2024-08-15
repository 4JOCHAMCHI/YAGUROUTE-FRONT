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
            <option v-for="team in uniqueTeams" :key="team" :value="team">{{ team }}</option>
          </select>
          <select v-model="selectedStadium" @change="applyFilters" class="filter-item">
            <option value="">모든 구장</option>
            <option v-for="stadium in uniqueStadiums" :key="stadium" :value="stadium">{{ stadium }}</option>
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
      <div class="auth-buttons">
        <button @click="login" class="auth-button">로그인</button>
        <button @click="register" class="auth-button">회원가입</button>
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
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const games = ref([]);
    const filteredGames = ref([]);
    const teamRanks = ref([]);
    const teamLogos = ref({});
    const selectedDate = ref('');
    const selectedTeam = ref('');
    const selectedStadium = ref('');
    const currentPage = ref(0);
    const pageSize = 5;

    const uniqueDates = computed(() => {
      if (games.value.length === 0) return [];
      const dates = games.value.map(game => game.gameDate);
      return [...new Set(dates)];
    });

    const uniqueTeams = computed(() => {
      if (games.value.length === 0) return [];
      const teams = games.value.flatMap(game => [game.homeTeamName, game.awayTeamName]);
      return [...new Set(teams)];
    });

    const uniqueStadiums = computed(() => {
      if (games.value.length === 0) return [];
      const stadiums = games.value.map(game => game.stadiumName);
      return [...new Set(stadiums)];
    });

    const totalPages = computed(() => Math.ceil(filteredGames.value.length / pageSize));

    const paginatedGames = computed(() => {
      const start = currentPage.value * pageSize;
      return filteredGames.value.slice(start, start + pageSize);
    });

    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:8080/game/all');
        games.value = response.data.sort((a, b) => new Date(a.gameDate) - new Date(b.gameDate));
        applyFilters();
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    const fetchTeamRanks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/ranking/all');
        teamRanks.value = response.data;

        for (let rank of teamRanks.value) {
          const logoResponse = await axios.get(
              `http://localhost:8080/teams/logo/${rank.teamId}`
          );
          teamLogos.value[rank.teamId] = logoResponse.data;
        }
      } catch (error) {
        console.error('Error fetching team ranks:', error);
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

    const goToBookingPage = (gameId) => {
      router.push({ name: 'TicketBookingView', params: { gameId } });
    };

    const login = () => {
      console.log('로그인');
    };

    const register = () => {
      console.log('회원가입');
    };

    onMounted(() => {
      fetchGames();
      fetchTeamRanks();  // 팀 순위 데이터를 가져옴
    });

    return {
      games,
      goToBookingPage,
      teamRanks,
      teamLogos,
      selectedDate,
      selectedTeam,
      selectedStadium,
      uniqueDates,
      uniqueTeams,
      uniqueStadiums,
      paginatedGames,
      currentPage,
      totalPages,
      prevPage,
      nextPage,
      formatDate,
      formatTime,
      login,
      register,
      applyFilters,
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 강도를 약간 높임 */
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
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.filter-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 호버 시 가벼운 그림자 */
  border-color: #bbb; /* 호버 시 테두리 색상 살짝 변경 */
}

.games-table, .ranking-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  transition: box-shadow 0.3s ease;
}

.games-table th, .games-table td,
.ranking-table th, .ranking-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.3s ease;
}

.games-table th, .ranking-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.games-table tr:hover, .ranking-table tr:hover {
  background-color: #f0f0f0; /* 호버 시 행 배경색 변경 */
}

.games-table:hover, .ranking-table:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); /* 호버 시 테이블에 그림자 강화 */
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
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: box-shadow 0.3s ease, background-color 0.3s ease;
}

.pagination-button:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 호버 시 그림자 추가 */
}

.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.page-info {
  margin: 0 1rem;
}

.auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.auth-button {
  padding: 0.75rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.auth-button:hover {
  background-color: #ff5252;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 호버 시 그림자 추가 */
}

.book-button {
  padding: 0.5rem 1rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.book-button:hover {
  background-color:  #e65555; 
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
  transition: box-shadow 0.3s ease;
}

.team-logo:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 호버 시 로고에 그림자 추가 */
}
</style>
