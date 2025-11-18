import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
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
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string | null
  stock: number
  category: string | null
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    // URL 파라미터에서 카테고리 읽기
    const categoryParam = searchParams.get("category") || "all"
    setSelectedCategory(categoryParam)
  }, [searchParams])

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [selectedCategory])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("category")
        .not("category", "is", null)

      if (error) throw error

      const uniqueCategories = Array.from(
        new Set(data.map((item) => item.category).filter(Boolean))
      ) as string[]
      setCategories(uniqueCategories.sort())
    } catch (error) {
      console.error("카테고리 조회 실패:", error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      let query = supabase.from("products").select("*")

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("상품 조회 실패:", error)
      toast.error("상품을 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setSearchParams({ category })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">상품 목록</h1>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => handleCategoryChange("all")}
            size="sm"
          >
            전체
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => handleCategoryChange(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* 상품 그리드 */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-muted" />
              <CardHeader>
                <div className="h-4 bg-muted rounded" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">상품이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
              <Link to={`/products/${product.id}`}>
                <div className="aspect-square overflow-hidden bg-muted">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </Link>
              <CardHeader>
                <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
                  {product.stock > 0 ? (
                    <Badge variant="secondary">재고 {product.stock}개</Badge>
                  ) : (
                    <Badge variant="destructive">품절</Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full"
                  disabled={product.stock === 0}
                >
                  <Link to={`/products/${product.id}`}>상세보기</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

