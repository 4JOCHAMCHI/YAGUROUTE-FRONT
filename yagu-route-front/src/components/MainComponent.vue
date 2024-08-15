<!-- src/components/MainComponent.vue -->
<template>
  <div class="main-container">
    <div class="left-container">
      <h2>로고</h2>
      <div class="filters">
        <input type="date" v-model="selectedDate" @change="fetchGames" />
      </div>
      <table class="games-table">
        <thead>
        <tr>
          <th>날짜</th>
          <th>시간</th>
          <th>홈팀</th>
          <th>원정팀</th>
          <th>구장</th>
          <th>예매</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="game in games" :key="game.gameId">
          <td>{{ formatDate(game.gameDate) }}</td>
          <td>{{ formatTime(game.gameTime) }}</td>
          <td>
            <img :src="getTeamLogo(game.homeTeamName)" alt="홈팀 로고" class="team-logo">
            {{ game.homeTeamName }}
          </td>
          <td>
            <img :src="getTeamLogo(game.awayTeamName)" alt="원정팀 로고" class="team-logo">
            {{ game.awayTeamName }}
          </td>
          <td>{{ game.stadiumName }}</td>
          <td>
            <button class="book-button" :disabled="game.sellable !== 'S'" @click="bookGame(game.gameId)">
              {{ game.sellable === 'S' ? '예매하기' : '예매불가' }}
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="right-container">
      <div class="auth-buttons">
        <button @click="login">로그인</button>
        <button @click="register">회원가입</button>
      </div>
      <div class="team-rankings">
        <h3>순위</h3>
        <table>
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
              <img :src="teamLogos[rank.teamId]" alt="팀 로고" class="team-logo">
            </td>
            <td>{{ getTeamName(rank.teamId) }}</td>
            <td>{{ rank.gamesBehind }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const games = ref([]);
    const teamRanks = ref([]);
    const teamLogos = ref({});
    const selectedDate = ref(new Date().toISOString().split('T')[0]);

    const fetchGames = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/game/date`, {
          params: {
            date: selectedDate.value,
            limit: 5,
          },
        });
        games.value = response.data;
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    const fetchTeamRanks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/ranking/all');
        teamRanks.value = response.data;

        // Fetch team logos
        for (let rank of teamRanks.value) {
          const logoResponse = await axios.get(`http://localhost:8080/teams/logo/${rank.teamId}`);
          teamLogos.value[rank.teamId] = logoResponse.data;
        }
      } catch (error) {
        console.error('Error fetching team ranks:', error);
      }
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatTime = (time) => {
      return time.slice(0, 5);
    };

    const getTeamLogo = (teamName) => {
      return `/assets/logos/${teamName}.png`;
    };

    const getTeamName = (teamId) => {
      const team = teamRanks.value.find((rank) => rank.teamId === teamId);
      return team ? team.teamName : `팀 ${teamId}`;
    };

    const bookGame = (gameId) => {
      console.log(`예매하기: ${gameId}`);
    };

    const login = () => {
      console.log('로그인');
    };

    const register = () => {
      console.log('회원가입');
    };

    onMounted(() => {
      fetchGames();
      fetchTeamRanks(); // 컴포넌트가 마운트될 때 팀 순위 데이터를 가져옴
    });

    return {
      games,
      teamRanks,
      teamLogos,
      selectedDate,
      formatDate,
      formatTime,
      getTeamLogo,
      getTeamName,
      bookGame,
      login,
      register,
    };
  },
};
</script>

<style scoped>
.main-container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.left-container {
  width: 70%;
}

.right-container {
  width: 25%;
}

.filters {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-start;
}

.games-table {
  width: 100%;
  border-collapse: collapse;
}

.games-table th,
.games-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.team-logo {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.auth-buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  margin-bottom: 20px;
}

.team-rankings table {
  width: 100%;
  border-collapse: collapse;
}

.team-rankings th,
.team-rankings td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

button {
  padding: 5px 10px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #ff5252;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
