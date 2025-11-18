import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { User, ShoppingCart, LogOut, UserCircle, Package } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface Profile {
  id: string
  email: string
  name: string
}

export default function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // 현재 세션 확인
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user.id)
        await fetchCartCount(session.user.id)
      } else {
        setLoading(false)
      }
    }

    checkSession()

    // 인증 상태 변경 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
        await fetchCartCount(session.user.id)
      } else {
        setProfile(null)
        setCartCount(0)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error("프로필 로드 실패:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCartCount = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("cart")
        .select("*", { count: "exact", head: false })
        .eq("user_id", userId)

      if (error) throw error
      // quantity의 합계를 계산
      const totalQuantity = data?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0
      setCartCount(totalQuantity)
    } catch (error) {
      console.error("장바구니 개수 조회 실패:", error)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast.success("로그아웃되었습니다.")
      navigate("/")
    } catch (error: any) {
      console.error("로그아웃 실패:", error)
      toast.error("로그아웃에 실패했습니다.", {
        description: error.message,
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <nav className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold">
                쇼핑몰
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* 좌측: 로고 */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              쇼핑몰
            </Link>
          </div>

          {/* 우측: 로그인 상태에 따른 버튼 */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* 장바구니 아이콘 + 개수 뱃지 */}
                <Link to="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                      >
                        {cartCount > 99 ? "99+" : cartCount}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {/* 프로필 드롭다운 메뉴 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={undefined} alt={profile?.name || "User"} />
                        <AvatarFallback>
                          {profile?.name ? getInitials(profile.name) : <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{profile?.name || "사용자"}</p>
                      <p className="text-xs text-muted-foreground">{profile?.email || user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <UserCircle className="mr-2 h-4 w-4" />
                        내정보
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="flex items-center">
                        <Package className="mr-2 h-4 w-4" />
                        주문 내역
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/cart" className="flex items-center">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        장바구니
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">로그인</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">회원가입</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

