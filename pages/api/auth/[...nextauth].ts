// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "seu_usuario" },
                password: { label: "Password", type: "password", placeholder: "sua_senha" },
            },
            async authorize(credentials) {
                // Verifique se credentials não é undefined
                if (!credentials) {
                    return null; // Retorna null se credentials for undefined
                }

                // Implementação para autenticar o usuário
                const user = { id: '1', name: 'Admin', email: 'admin@example.com' }; // Exemplo de usuário

                // Se a autenticação falhar, retorne null
                if (credentials.username === 'seu_usuario' && credentials.password === 'sua_senha') {
                    return user; // Retorna o usuário se a autenticação for bem-sucedida
                } else {
                    return null; // Retorna null se a autenticação falhar
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id; // Armazena o ID do usuário no token
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string; // Define o ID do usuário na sessão
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin', // Customize a página de login, se necessário
    },
    secret: process.env.NEXTAUTH_SECRET, // Use uma chave secreta para proteger o NextAuth
});
