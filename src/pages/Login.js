import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import ImageLight from '../assets/img/login-office.jpeg';
import ImageDark from '../assets/img/login-office-dark.jpeg';
import { GithubIcon, TwitterIcon } from '../icons';
import { Label, Input, Button } from '@windmill/react-ui';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiKey = '0d85ffb914de0f208ea835b356104eef';
  const apiUrl = 'https://www.vendus.co.ao/ws/v1.1';

  // Função para buscar o ID do usuário pelo e-mail
  const buscarUsuarioPorEmail = async (email) => {
    try {
      const response = await axios.get(`${apiUrl}/account/users`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      const usuarios = response.data;
      const usuario = usuarios.find((user) => user.email === email);
      return usuario ? usuario.id : null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  };

  // Função para fazer login
  const handleLogin = async (e) => {
    e.preventDefault();

    // Verificar se email e senha foram preenchidos
    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    // Resetar mensagem de erro e iniciar o estado de carregamento
    setError(null);
    setLoading(true);

    try {
      // Buscar o ID do usuário pelo e-mail
      const userId = await buscarUsuarioPorEmail(email);

      if (!userId) {
        setError('Usuário não encontrado.');
        return;
      }

      // Requisição para obter os detalhes do usuário pelo ID
      const userResponse = await axios.patch(`${apiUrl}/account/users/${userId}`, {}, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      const usuario = userResponse.data;

      // Comparar a senha fornecida com a senha retornada
      if (usuario.password === password) {
        window.location.href = '/app'; // Redirecionar para a página principal
      } else {
        setError('Email ou senha inválidos.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false); // Finalizar o estado de carregamento
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Login
              </h1>

              {error && <p className="text-red-500">{error}</p>}

              <form onSubmit={handleLogin}>
                <Label>
                  <span>Email</span>
                  <Input
                    className="mt-1"
                    type="email"
                    placeholder="john@doe.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Label>

                <Label className="mt-4">
                  <span>Senha</span>
                  <Input
                    className="mt-1"
                    type="password"
                    placeholder="***************"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Label>

                <Button className="mt-4" block type="submit" disabled={loading}>
                  {loading ? 'Entrando...' : 'Log in'}
                </Button>
              </form>

              <hr className="my-8" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Login;
