// utils/guestId.ts
export const getGuestId = () => {
  const key = "guest_user_id";

  let guestId = sessionStorage.getItem(key);

  if (!guestId) {
    guestId = generateObjectId();
    sessionStorage.setItem(key, guestId);
  }

  return guestId;
};

// Hàm tạo ObjectId hợp lệ 24 ký tự hex
const generateObjectId = () => {
  const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
  const random = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return timestamp + random;
};
