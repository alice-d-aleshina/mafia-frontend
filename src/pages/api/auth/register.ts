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

    const { data, error } = await supabase.auth.signUp({
      email: username, // Supabase требует email для регистрации
      password,
      options: {
        data: {
          username,
          // Дополнительные пользовательские данные можно добавить здесь
        }
      }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      post: {
        id: data.user?.id,
        username: username,
        role: 'user', // По умолчанию устанавливаем роль user
        // Другие данные о пользователе
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'An error occurred during registration' });
  }
}