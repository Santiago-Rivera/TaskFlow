import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#1565C0',
        secondary: '#1976D2',
        accent: '#FF9800',
        error: '#F44336',
        warning: '#FF9800',
        info: '#2196F3',
        success: '#4CAF50',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        cardBg: '#FFFFFF',
        textPrimary: '#212121',
        textSecondary: '#757575',
        border: '#E0E0E0',
        hover: '#F5F5F5',
      },
      dark: {
        primary: '#64B5F6',
        secondary: '#42A5F5',
        accent: '#FFB74D',
        error: '#EF5350',
        warning: '#FFB74D',
        info: '#42A5F5',
        success: '#66BB6A',
        background: '#121212',
        surface: '#1E1E1E',
        cardBg: '#2D2D2D',
        textPrimary: '#FFFFFF',
        textSecondary: '#B0B0B0',
        border: '#404040',
        hover: '#3A3A3A',
      },
    },
  },
});
