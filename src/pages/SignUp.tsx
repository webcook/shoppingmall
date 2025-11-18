import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
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
import { useState } from "react"

const signUpSchema = z
  .object({
    email: z.string().email("올바른 이메일 형식이 아닙니다."),
    name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다."),
    password: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "비밀번호는 대소문자와 숫자를 포함해야 합니다."
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  })

type SignUpFormValues = z.infer<typeof signUpSchema>

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange", // 실시간 유효성 검증
  })

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true)

    try {
      // Supabase Auth를 통한 회원가입
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        throw authError
      }

      if (authData.user) {
        // 트리거가 자동으로 profiles 테이블에 데이터를 생성합니다
        // 혹시 트리거가 실패한 경우를 대비해 수동으로도 처리
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert(
            {
              id: authData.user.id,
              email: data.email,
              name: data.name,
            },
            {
              onConflict: "id",
            }
          )

        if (profileError) {
          console.error("Profile creation error:", profileError)
          // 프로필 생성 실패는 치명적이지 않으므로 계속 진행
        }

        toast.success("회원가입이 완료되었습니다!", {
          description: "이메일 인증이 필요합니다. 이메일을 확인해주세요.",
        })

        // 성공 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      }
    } catch (error: any) {
      console.error("Sign up error:", error)

      // 이메일 회원가입이 비활성화된 경우
      if (
        error.message?.includes("Email signups are disabled") ||
        error.message?.includes("email_provider_disabled") ||
        error.code === "email_provider_disabled"
      ) {
        toast.error("이메일 회원가입이 비활성화되어 있습니다.", {
          description: "Supabase 대시보드에서 이메일 회원가입을 활성화해주세요.",
          duration: 6000,
        })
      } else {
        toast.error("회원가입에 실패했습니다.", {
          description: error.message || "다시 시도해주세요.",
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
            회원가입
          </CardTitle>
          <CardDescription className="text-center">
            계정을 생성하여 쇼핑을 시작하세요
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="홍길동"
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
                        placeholder="최소 8자, 대소문자+숫자"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호 확인</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="비밀번호를 다시 입력하세요"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "처리 중..." : "회원가입"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              로그인
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

