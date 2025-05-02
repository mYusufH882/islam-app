import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';

// Definisikan interface untuk tipe data yang digunakan di dashboard
interface BlogStats {
  total: number;
  published: number;
  draft: number;
}

interface UserStats {
  total: number;
  active: number;
  inactive: number;
}

interface BookmarkStats {
  total: number;
  thisMonth: number;
}

interface ChartData {
  labels: string[];
  data: number[];
}

interface CategoryDistribution {
  name: string;
  count: number;
  percentage: number;
}

interface Activity {
  id: string;
  title: string;
  type: string;
  user: string;
  date: string;
  link: string;
}

interface DashboardState {
  // Stats data
  blogStats: BlogStats;
  userStats: UserStats;
  bookmarkStats: BookmarkStats;
  
  // Chart data
  blogChartData: ChartData;
  userChartData: ChartData;
  categoryDistribution: CategoryDistribution[];
  
  // Activities
  recentActivities: Activity[];
  
  // Loading states
  loadingStats: boolean;
  loadingCharts: boolean;
  loadingActivities: boolean;
  
  // Error states
  statsError: string | null;
  chartsError: string | null;
  activitiesError: string | null;
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    // Stats data dengan nilai default
    blogStats: {
      total: 0,
      published: 0,
      draft: 0
    },
    userStats: {
      total: 0,
      active: 0,
      inactive: 0
    },
    bookmarkStats: {
      total: 0,
      thisMonth: 0
    },
    
    // Chart data dengan nilai default
    blogChartData: {
      labels: [],
      data: []
    },
    userChartData: {
      labels: [],
      data: []
    },
    categoryDistribution: [],
    
    // Activities dengan array kosong
    recentActivities: [],
    
    // Loading states
    loadingStats: false,
    loadingCharts: false,
    loadingActivities: false,
    
    // Error states
    statsError: null,
    chartsError: null,
    activitiesError: null
  }),
  
  actions: {
    // Fetch dashboard stats
    async fetchStats() {
      const { apiFetch } = useApi();
      this.loadingStats = true;
      this.statsError = null;
      
      try {
        const { data, error } = await apiFetch('/admin/dashboard/stats');
        
        if (error.value) {
          throw new Error('Gagal mengambil data statistik dashboard');
        }
        
        if (data.value && data.value.success) {
          const statsData = data.value.data;
          this.blogStats = statsData.blogStats;
          this.userStats = statsData.userStats;
          this.bookmarkStats = statsData.bookmarkStats;
        } else {
          throw new Error('Format respons API tidak valid');
        }
      } catch (err: any) {
        console.error('Error fetching dashboard stats:', err);
        this.statsError = err.message || 'Terjadi kesalahan saat mengambil data statistik';
      } finally {
        this.loadingStats = false;
      }
    },
    
    // Fetch chart data
    async fetchChartData() {
      const { apiFetch } = useApi();
      this.loadingCharts = true;
      this.chartsError = null;
      
      try {
        const { data, error } = await apiFetch('/admin/dashboard/chart-data');
        
        if (error.value) {
          throw new Error('Gagal mengambil data grafik dashboard');
        }
        
        if (data.value && data.value.success) {
          const chartData = data.value.data;
          this.blogChartData = chartData.blogChartData;
          this.userChartData = chartData.userChartData;
          this.categoryDistribution = chartData.categoryDistribution;
        } else {
          throw new Error('Format respons API tidak valid');
        }
      } catch (err: any) {
        console.error('Error fetching chart data:', err);
        this.chartsError = err.message || 'Terjadi kesalahan saat mengambil data grafik';
      } finally {
        this.loadingCharts = false;
      }
    },
    
    // Fetch recent activities
    async fetchRecentActivities() {
      const { apiFetch } = useApi();
      this.loadingActivities = true;
      this.activitiesError = null;
      
      try {
        const { data, error } = await apiFetch('/admin/dashboard/recent-activities');
        
        if (error.value) {
          throw new Error('Gagal mengambil data aktivitas terbaru');
        }
        
        if (data.value && data.value.success) {
          this.recentActivities = data.value.data.activities;
        } else {
          throw new Error('Format respons API tidak valid');
        }
      } catch (err: any) {
        console.error('Error fetching recent activities:', err);
        this.activitiesError = err.message || 'Terjadi kesalahan saat mengambil aktivitas terbaru';
      } finally {
        this.loadingActivities = false;
      }
    },
    
    // Fetch all dashboard data at once
    async fetchAllDashboardData() {
      await Promise.all([
        this.fetchStats(),
        this.fetchChartData(),
        this.fetchRecentActivities()
      ]);
    }
  }
});