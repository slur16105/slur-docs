#!/bin/sh
# SLUR 스킬 설치 — https://docs.slur.co.kr/skill/install.sh
#
#   curl -fsSL https://docs.slur.co.kr/skill/install.sh | sh
#
# slur-guidelines(문법) + slur-design(어휘) 두 스킬 폴더를 내려받는다.
# 기본 위치는 현재 디렉터리의 .claude/skills (Claude Code 프로젝트 스킬).
#   전역 설치:  SLUR_SKILLS_DIR=~/.claude/skills sh install.sh
#   다른 도구:  SLUR_SKILLS_DIR=<원하는 폴더> sh install.sh
# 하는 일은 하나뿐이다 — manifest.txt의 파일 목록을 같은 경로로 curl 한다. 그 외 아무것도 실행하지 않는다.
set -eu

BASE="${SLUR_SKILLS_BASE:-https://docs.slur.co.kr/skill}"
DEST="${SLUR_SKILLS_DIR:-.claude/skills}"

command -v curl >/dev/null 2>&1 || { echo "curl이 필요합니다." >&2; exit 1; }

files=$(curl -fsSL "$BASE/manifest.txt")
count=0
for f in $files; do
  case "$f" in
    */*) ;;            # 스킬 폴더(slur-guidelines/, slur-design/) 아래 경로만
    *) continue ;;
  esac
  case "$f" in
    *..*) continue ;;  # 상위 경로 이탈 방지
  esac
  mkdir -p "$DEST/$(dirname "$f")"
  curl -fsSL "$BASE/$f" -o "$DEST/$f"
  count=$((count + 1))
done

echo "SLUR skills: $count files → $DEST/slur-guidelines, $DEST/slur-design"
echo "Claude Code에서 \"슬러 시스템으로\" / \"슬러 디자인으로\"라고 부르면 된다. 문서: https://docs.slur.co.kr/design/ai-quickstart/"
