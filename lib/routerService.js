// 📌 routerService.js
let globalRouter = null;

export const setGlobalRouter = (router) => {
    globalRouter = router;
};

// ✅ Wait for router to initialize before redirecting
export const redirectToLogin = (retryCount = 0) => {
    if (globalRouter) {
        globalRouter.push("/login");
    } else if (retryCount < 10) { // Stop retrying after 10 attempts
        console.warn(`⏳ Router not initialized. Retrying... (${retryCount + 1})`);
        setTimeout(() => redirectToLogin(retryCount + 1), 100);
    } else {
        console.log("❌ Failed to set router after multiple attempts.");
    }
};
