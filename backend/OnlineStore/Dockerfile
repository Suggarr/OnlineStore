# Базовый образ для запуска ASP.NET Core
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5200
ENV ASPNETCORE_URLS=http://+:5200

# Образ для сборки проекта
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /src

# Копирование csproj-файлов по одному, чтобы кешировать restore
COPY OnlineStore.API/OnlineStore.API.csproj OnlineStore.API/
COPY OnlineStore.Application/OnlineStore.Application.csproj OnlineStore.Application/
COPY OnlineStore.Domain/OnlineStore.Domain.csproj OnlineStore.Domain/
COPY OnlineStore.Infrastructure/OnlineStore.Infrastructure.csproj OnlineStore.Infrastructure/
RUN dotnet restore OnlineStore.API/OnlineStore.API.csproj

# Копирование всех файлов
COPY . .

# Сборка и публикация
WORKDIR /src/OnlineStore.API
RUN dotnet build OnlineStore.API.csproj -c Release -o /app/build
RUN dotnet publish OnlineStore.API.csproj -c Release -o /app/publish

# Финальный минимальный образ
FROM base AS final
WORKDIR /app
COPY --from=build-env /app/publish .
ENTRYPOINT ["dotnet", "OnlineStore.API.dll"]
