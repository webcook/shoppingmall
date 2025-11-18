import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string | null
  stock: number
  category: string | null
  created_at: string
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (id) {
      fetchProduct(id)
    }
  }, [id])

  const fetchProduct = async (productId: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error("상품 조회 실패:", error)
      toast.error("상품을 불러오는데 실패했습니다.")
      navigate("/products")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

    // 로그인 확인
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error("로그인이 필요합니다.", {
        description: "장바구니에 담으려면 로그인해주세요.",
      })
      navigate("/login", { state: { from: `/products/${id}` } })
      return
    }

    setAddingToCart(true)
    try {
      // 기존 장바구니 아이템 확인
      const { data: existingItem } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .single()

      if (existingItem) {
        // 기존 아이템이 있으면 수량 증가
        const newQuantity = existingItem.quantity + quantity
        const { error } = await supabase
          .from("cart")
          .update({ quantity: newQuantity })
          .eq("id", existingItem.id)

        if (error) throw error
        toast.success("장바구니에 추가되었습니다.", {
          description: `수량이 ${newQuantity}개로 업데이트되었습니다.`,
        })
      } else {
        // 새 아이템 추가
        const { error } = await supabase.from("cart").insert({
          user_id: user.id,
          product_id: product.id,
          quantity: quantity,
        })

        if (error) throw error
        toast.success("장바구니에 추가되었습니다.")
      }
    } catch (error: any) {
      console.error("장바구니 추가 실패:", error)
      toast.error("장바구니에 추가하는데 실패했습니다.", {
        description: error.message,
      })
    } finally {
      setAddingToCart(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price)
  }

  const handleQuantityChange = (delta: number) => {
    if (!product) return
    const newQuantity = Math.max(1, Math.min(product.stock, quantity + delta))
    setQuantity(newQuantity)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-48 bg-muted rounded" />
          <div className="grid gap-8 md:grid-cols-2">
            <div className="aspect-square bg-muted rounded" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded" />
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">상품을 찾을 수 없습니다.</p>
          <Button onClick={() => navigate("/products")} className="mt-4">
            상품 목록으로 돌아가기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate("/products")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        상품 목록
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        {/* 상품 이미지 */}
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingCart className="h-24 w-24 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
            )}
            <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary">
              {formatPrice(product.price)}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>상품 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">상품 설명</p>
                <p className="mt-1">{product.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">재고</p>
                {product.stock > 0 ? (
                  <Badge variant="secondary" className="mt-1">
                    {product.stock}개 남음
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="mt-1">
                    품절
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 수량 선택 및 장바구니 버튼 */}
          {product.stock > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium">수량</p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  (최대 {product.stock}개)
                </span>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {addingToCart ? "추가 중..." : "장바구니에 담기"}
              </Button>
            </div>
          ) : (
            <Button disabled className="w-full" size="lg">
              품절된 상품입니다
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

