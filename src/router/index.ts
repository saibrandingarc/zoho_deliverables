import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';
import { getZohoToken, clearExpiredZohoToken } from '@/utils/tokenManager'; // Import utility functions

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/:pathMatch(.*)*',
            component: () => import('@/views/pages/Error404.vue')
        },
        MainRoutes,
        AuthRoutes
    ]
});

// router.beforeEach((to, from, next) => {
//     const isAuthenticated = !!localStorage.getItem('zoho_access_token'); // Replace with your actual authentication check logic
  
//     if (to.meta.requiresAuth && !isAuthenticated) {
//       next({ name: 'Login' });
//     } else {
//       next();
//     }
// });

// Add a global before guard
router.beforeEach((to, from, next) => {
  // Clear expired token on each navigation
  clearExpiredZohoToken();
  
  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    const token = getZohoToken();
    
    if (token) {
      // Token is valid, allow navigation
      next();
    } else {
      console.log("login");
      // No token or token is expired, redirect to login
      next({ name: 'Login' });
    }
  } else {
    // Route does not require authentication
    next();
  }
});

export default router;