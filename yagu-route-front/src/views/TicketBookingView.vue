<template>
  <div class="seat-reservation">
    <h1>경기 정보</h1>
    <div v-if="loading">좌석 정보를 불러오는 중...</div>
    <div v-else class="reservation-layout">
      <div class="seat-grid-container">
        <div class="seat-grid" :style="gridStyle">
          <div
              v-for="seat in seats"
              :key="seat.seatId"
              :class="['seat', { 'selected': isSelected(seat), 'occupied': isOccupied(seat) }]"
              @click="selectSeat(seat)"
          >
            {{ seat.seatNum }}
          </div>
        </div>
      </div>
      <div class="selected-seat-container">
        <div class="selected-seat">
          <h2>선택한 좌석:</h2>
          <p v-if="selectedSeat">{{ selectedSeat.seatNum }}</p>
          <p v-else>좌석을 선택해주세요.</p>
        </div>
        <button @click="reserveSeat(id, selectedSeat.seatId)" :disabled="!selectedSeat">예매하기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from "axios";

const props = defineProps({
  gameId: 0
})

const id = ref(props.gameId);

const seats = ref([])
const occupiedSeats = ref([])
const selectedSeat = ref(null)
const loading = ref(true)

const gridStyle = computed(() => {
  const seatList = seats.value;
  const maxCol = seatList.length > 0 ? Math.max(...seatList.map(seat => seat.seatCol)) : 0

  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${maxCol}, 1fr)`,
    gap: '10px',
  }
})

const isSelected = (seat) => selectedSeat.value && selectedSeat.value.seatId === seat.seatId
const isOccupied = (seat) => occupiedSeats.value.some(occupiedSeat => occupiedSeat.seatId === seat.seatId)

const selectSeat = (seat) => {
  if (isOccupied(seat)) return
  selectedSeat.value = seat.seatId === selectedSeat.value?.seatId ? null : seat
}

const reserveSeat = async (gameId, seatId) => {
  if (selectedSeat.value) {
    try {
      let url = `http://localhost:8080/ticket/1/${gameId}/${seatId}`;
      const response = await axios.post(url)

      alert(selectedSeat.value.seatNum + "번 " + response.data.message);

    } catch (error) {
      console.error("Error: " + error.message);
      alert("Error: " + error.message);
    }

    occupiedSeats.value.push(selectedSeat.value)
    selectedSeat.value = null
  }
}



// 전체 좌석 정보를 가져오는 함수
const fetchAllSeats = async (gameId) => {
  try {
    let url = `http://localhost:8080/seat/all/${gameId}`;
    const response = await axios.get(url);

    if (response.status === 200) {
      console.log(response.data);
      return response.data.result.allSeats;
    } else {
      console.error("Error: Response status is not 200");
    }
  } catch (error) {
    console.error("Fetch error: " + error.message);
  }

  await new Promise(resolve => setTimeout(resolve, 1000))
}

// 예매 불가능한 좌석 정보를 가져오는 함수
const fetchOccupiedSeats = async (gameId) => {
  try {
    let url = `http://localhost:8080/seat/occupied/${gameId}`;
    const response = await axios.get(url);

    if (response.status === 200) {
      return response.data.result.seats;
    } else {
      console.error("Error: Response status is not 200");
    }
  } catch (error) {
    console.error("Fetch error: " + error.message);
  }
  await new Promise(resolve => setTimeout(resolve, 1000))
}

onMounted(async () => {
  try {
    const [allSeats, unavailableSeats] = await Promise.all([
      fetchAllSeats(id.value),
      fetchOccupiedSeats(id.value)
    ])

    seats.value = allSeats;
    occupiedSeats.value = unavailableSeats;
  } catch (error) {
    console.error('좌석 정보를 불러오는 데 실패했습니다:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.seat-reservation {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin: 50px 0;
}

h2 {
  font-size: 25px;
  margin-bottom: 20px;
}

.reservation-layout {
  display: grid;
  grid-template-columns: 3.2fr 0.8fr;
  gap: 20px;
  height: 450px; /* 고정 높이 설정 */
}

.seat-grid-container {
  padding: 5px;
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.seat-grid {
  display: grid;
  gap: 3px;
  width: 100%;
  height: 100%;
}

.selected-seat-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 100%;
}

.seat {
  padding: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  text-align: center;
}

.seat.selected {
  background-color: #64dced;
  color: white;
}

.seat.occupied {
  background-color: #afafaf;
  color: white;
  cursor: not-allowed;
}

.selected-seat {
  flex-grow: 1;
}

button {
  padding: 10px 20px;
  background-color: #cf1c4e;
  color: white;
  border: none;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>