#!/bin/sh
# SLUR 스킬 설치 — https://docs.slur.co.kr/skill/install.sh
#
#   curl -fsSL https://docs.slur.co.kr/skill/install.sh | sh
#
# slur-guidelines(문법) + slur-design(어휘) 두 스킬 폴더를 내려받는다.
# 기본 위치는 현재 디렉터리의 .claude/skills (Claude Code 프로젝트 스킬).
#   전역 설치:  curl -fsSL https://docs.slur.co.kr/skill/install.sh | SLUR_SKILLS_DIR=~/.claude/skills sh
#   다른 도구:  SLUR_SKILLS_DIR=<원하는 폴더>
# 하는 일은 하나뿐이다 — slur-skills.tar.gz(두 스킬 폴더 묶음, 빌드 때 만들어짐) 하나를 받아 그 자리에 푼다.
# 그 외 아무것도 실행하지 않는다. 파일 목록은 같은 경로의 manifest.txt, 최신 버전은 같은 경로의 VERSION.
set -eu

BASE="${SLUR_SKILLS_BASE:-https://docs.slur.co.kr/skill}"
DEST="${SLUR_SKILLS_DIR:-.claude/skills}"

command -v curl >/dev/null 2>&1 || { echo "curl이 필요합니다." >&2; exit 1; }
command -v tar  >/dev/null 2>&1 || { echo "tar가 필요합니다." >&2; exit 1; }

mkdir -p "$DEST"
curl -fsSL "$BASE/slur-skills.tar.gz" | tar -xzf - -C "$DEST"

count=$(find "$DEST/slur-guidelines" "$DEST/slur-design" -type f 2>/dev/null | wc -l | tr -d ' ')
ver=$(cat "$DEST/slur-guidelines/VERSION" 2>/dev/null || echo "?")
echo "SLUR skills v$ver: $count files → $DEST/slur-guidelines, $DEST/slur-design (버전은 각 폴더의 VERSION 파일)"
echo "Claude Code에서 \"슬러 시스템으로\" / \"슬러 디자인으로\"라고 부르면 된다. 문서: https://docs.slur.co.kr/design/ai-quickstart/"
