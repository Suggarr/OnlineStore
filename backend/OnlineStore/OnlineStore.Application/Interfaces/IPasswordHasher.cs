﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineStore.Application.Interfaces
{
    public interface IPasswordHasher
    {
        Task<string> HashPassword(string password);
        Task<bool> VerifyPassword(string hashedPassword, string providedPassword);
    }
}
