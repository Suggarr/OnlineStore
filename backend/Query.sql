UPDATE [onlinestore.db].[dbo].[Users]
SET [Role] = 'Admin'  -- Замените 'НоваяРоль' на нужное значение
WHERE [UserName] = 'Sahar';  -- Замените @UserId на идентификатор пользователя, чью роль вы хотите изменить