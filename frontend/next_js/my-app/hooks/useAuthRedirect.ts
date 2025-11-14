"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuthRedirect(apiUrl: string) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(apiUrl, {
                    credentials: "include",
                });

                if (res.status === 401) {
                    router.push("/login");
                    setIsAuthorized(false);
                    return;
                }

                setIsAuthorized(true);
            }
            catch (err) {
                console.log("Ошибка при проверке авторизации:", err);
                router.push("/login");
                setIsAuthorized(false);
            }
        };

        checkAuth();
    }, [apiUrl, router])
    return {isAuthorized}
}