const nextConfig = {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.mercadopago.com https://www.googletagmanager.com https://www.gstatic.com https://js-agent.newrelic.com *.hotjar.com *.nr-data.net *.mlstatic.com; object-src 'none';`,
            },
          ],
        },
      ];
    },
  };
  
  module.exports = nextConfig;
  