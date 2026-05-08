import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "📦 언박싱 마스터 - 진열 퍼즐 게임" },
      {
        name: "description",
        content:
          "컨베이어 벨트에서 상자를 열고 진열장에 아이템을 배치하는 캐주얼 퍼즐 게임. 콤보, 압박감, 화려한 연출!",
      },
      { property: "og:title", content: "📦 언박싱 마스터" },
      { property: "og:description", content: "상자를 열고 아이템을 진열하라!" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen w-full bg-background">
      <h1 className="sr-only">언박싱 마스터</h1>
      <iframe
        src="/game/index.html"
        title="언박싱 마스터"
        className="block h-screen w-full border-0"
      />
    </main>
  );
}
