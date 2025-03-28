// 📌 routerService.js
let globalRouter = null;

export const setGlobalRouter = (router) => {
    globalRouter = router;
};

// ✅ Wait for router to initialize before redirecting
export const redirectToLogin = () => {
    if (globalRouter) {
        globalRouter.push("/login");
    } else {
        console.warn("⏳ Router not initialized. Retrying in 100ms...");
        setTimeout(redirectToLogin, 100); // Retry until router is available
    }
};
