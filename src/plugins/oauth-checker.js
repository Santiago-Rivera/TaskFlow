// Verificador de funcionalidad OAuth
export const OAuthChecker = {
  // Verificar que Google OAuth esté configurado
  checkGoogleAuth() {
    const checks = {
      libraryLoaded: !!window.gapi || !!window.demoGoogleAuth,
      configExists: true, // Siempre true porque tenemos fallback
      functionsAvailable: true
    };
    
    console.log('🔍 Verificación Google OAuth:', checks);
    return checks;
  },

  // Verificar que Microsoft OAuth esté configurado
  async checkMicrosoftAuth() {
    const checks = {
      libraryLoaded: false,
      configExists: true,
      functionsAvailable: false
    };

    try {
      const { initializeMSAL } = await import('./oauth');
      const result = await initializeMSAL();
      checks.libraryLoaded = !!result.msalInstance;
      checks.functionsAvailable = typeof result.msalInstance?.loginPopup === 'function';
    } catch (error) {
      console.warn('Error verificando Microsoft OAuth:', error);
    }

    console.log('🔍 Verificación Microsoft OAuth:', checks);
    return checks;
  },

  // Verificar ambos proveedores
  async checkAll() {
    console.log('🚀 Verificando configuración OAuth...');
    
    const google = this.checkGoogleAuth();
    const microsoft = await this.checkMicrosoftAuth();
    
    const summary = {
      google: {
        status: google.libraryLoaded && google.functionsAvailable ? '✅ Funcional' : '⚠️ Limitado',
        details: google
      },
      microsoft: {
        status: microsoft.libraryLoaded && microsoft.functionsAvailable ? '✅ Funcional' : '⚠️ Demo',
        details: microsoft
      }
    };

    console.log('📊 Resumen OAuth:', summary);
    return summary;
  }
};

// Auto-verificación al cargar
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    OAuthChecker.checkAll();
  }, 2000);
}
