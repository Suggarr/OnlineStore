UPDATE [onlinestore.db].[dbo].[Users]
SET [Role] = 'Admin'  -- �������� '���������' �� ������ ��������
WHERE [UserName] = 'Sahar';  -- �������� @UserId �� ������������� ������������, ��� ���� �� ������ ��������