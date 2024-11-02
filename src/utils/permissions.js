// تشفير البيانات باستخدام btoa
const encryptData = (data) => {
  return btoa(encodeURIComponent(JSON.stringify(data)));
};

// فك تشفير البيانات باستخدام atob
const decryptData = (encryptedData) => {
  try {
    return JSON.parse(decodeURIComponent(atob(encryptedData)));
  } catch (error) {
    console.error("Error decrypting data:", error);
    return null;
  }
};

// حفظ الصلاحيات في localStorage بعد التشفير بناءً على المستخدم الحالي
export const savePermissionsToLocalStorage = (permissions, userId) => {
  const encryptedPermissions = encryptData(permissions);
  localStorage.setItem(`permissions_${userId}`, encryptedPermissions);
};

// استرجاع الصلاحيات من localStorage بعد فك التشفير بناءً على المستخدم الحالي
export const loadPermissionsFromLocalStorage = (userId) => {
  const storedPermissions = localStorage.getItem(`permissions_${userId}`);

  if (storedPermissions) {
    return decryptData(storedPermissions);
  }
  return null;
};

// مسح الصلاحيات القديمة من localStorage
export const clearOldPermissions = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("permissions_")) {
      localStorage.removeItem(key);
    }
  });
};

// دالة للتحقق من وجود صلاحيات محددة
export const hasPermission = (permissions, permissionName) => {
  return permissions?.[permissionName] === true;
};
