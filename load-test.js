import http from 'k6/http';
import { check, sleep } from 'k6';

// This configures the "Army"
export const options = {
  stages: [
    { duration: '10s', target: 50 }, // Ramp up to 50 concurrent users in 10s
    { duration: '20s', target: 50 }, // Stay at 50 users for 20s
    { duration: '10s', target: 0 },  // Ramp down to 0
  ],
};

// This is what every "soldier" does
export default function () {
  // They all hit your Product List API
  const res = http.get('http://localhost:3001/api/products');
  
  // They check if it worked (Status 200)
  check(res, { 'status was 200': (r) => r.status == 200 });
  
  sleep(1);
}