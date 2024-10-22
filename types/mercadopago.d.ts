declare module 'mercadopago' {
    const mercadopago: {
      configure: (config: { access_token: string }) => void;
      preferences: {
        create: (data: any) => Promise<any>;
      };
    };
    export default mercadopago;
  }
  