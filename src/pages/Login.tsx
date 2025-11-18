import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

const loginSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
  rememberMe: z.boolean(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // 이전 페이지 또는 홈으로 리다이렉트할 경로
  const from = (location.state as { from?: string })?.from || "/"

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)

    try {
      // Supabase Auth를 통한 로그인
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        throw authError
      }

      if (authData.user) {
        // 로그인 상태 유지 설정
        if (data.rememberMe) {
          // 세션을 영구적으로 유지 (Supabase는 기본적으로 1시간 후 만료)
          // rememberMe가 true일 때는 세션을 더 오래 유지하도록 설정
          // 실제로는 Supabase 대시보드에서 세션 만료 시간을 설정하거나
          // 클라이언트에서 주기적으로 refresh token을 갱신해야 함
          // 여기서는 단순히 로컬 스토리지에 rememberMe 플래그만 저장
          localStorage.setItem("rememberMe", "true")
        } else {
          localStorage.removeItem("rememberMe")
        }

        toast.success("로그인 성공!", {
          description: `${authData.user.email}님 환영합니다.`,
        })

        // 이전 페이지 또는 홈으로 리다이렉트
        navigate(from, { replace: true })
      }
    } catch (error: any) {
      console.error("Login error:", error)

      // 이메일 인증이 필요한 경우
      if (error.message?.includes("Email not confirmed") || error.message?.includes("email_not_confirmed")) {
        toast.error("이메일 인증이 필요합니다.", {
          description: "회원가입 시 발송된 이메일을 확인하여 인증을 완료해주세요.",
          duration: 5000,
        })
      } else {
        toast.error("로그인에 실패했습니다.", {
          description: error.message || "이메일과 비밀번호를 확인해주세요.",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            로그인
          </CardTitle>
          <CardDescription className="text-center">
            계정에 로그인하여 쇼핑을 계속하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        로그인 상태 유지
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            계정이 없으신가요?{" "}
            <Link
              to="/signup"
              className="text-primary hover:underline font-medium"
            >
              회원가입
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

