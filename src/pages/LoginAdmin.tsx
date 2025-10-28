// src/pages/LoginAdmin.tsx
import React from "react";
import { dependencies } from "../app/authDependencies";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useAuthViewModel } from "../app/viewmodels/authViewModel";

const LoginAdmin = () => {
  const {
    email,
    password,
    loading,
    error,
    setEmail,
    setPassword,
    handleSubmit,
  } = useAuthViewModel(dependencies.authUseCase);


  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Đăng Nhập Admin
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            {error && (
              <div className="p-2 text-sm text-red-500 bg-red-50 rounded">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full mt-6 font-medium bg-primary text-white rounded-2xl"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginAdmin;
