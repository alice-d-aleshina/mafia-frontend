import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../utils/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Преобразуем username в формат email, добавляя фиктивный домен
    const pseudoEmail = `${username}@example.com`;

    const { data, error } = await supabase.auth.signUp({
      email: pseudoEmail, // Используем псевдо-email
      password,
      options: {
        data: {
          username, // Сохраняем оригинальный username в метаданных
        }
      }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      post: {
        id: data.user?.id,
        username: username, // Возвращаем оригинальный username
        role: 'admin', // По умолчанию устанавливаем роль user
        // Другие данные о пользователе
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'An error occurred during registration' });
  }
}