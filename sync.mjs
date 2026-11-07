// 감사교회 저장소의 최신 프로토타입을 이 공개 폴더로 복사한다.
// 쓰는 법: node sync.mjs  → admin.html, member.html 갱신 → git commit, git push
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(import.meta.dirname, '..', '감사교회', '기획', '프로토타입');

function latest(prefix) {
  const files = readdirSync(SRC).filter((f) => f.startsWith(prefix) && f.endsWith('.html'));
  files.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  if (!files.length) throw new Error(prefix + ' 파일을 찾지 못했습니다');
  return files[files.length - 1];
}

const META = (desc) =>
  '<meta name="robots" content="noindex, nofollow">\n' +
  '<meta property="og:title" content="감사교회 프로토타입">\n' +
  '<meta property="og:description" content="' + desc + '">\n';

function put(src, out, desc, fix) {
  let s = readFileSync(join(SRC, src), 'utf8');
  s = s.replace('<meta name="viewport" content="width=device-width, initial-scale=1">\n', (m) => m + META(desc));
  s = fix(s);
  writeFileSync(join(import.meta.dirname, out), s);
  console.log(src + ' → ' + out);
}

put(latest('관리자웹_v'), 'admin.html', '관리자 웹 클릭 프로토타입 (예시 데이터)', (s) =>
  s.replace(/href="https:\/\/claude\.ai\/artifact\/[^"]+"/g, 'href="member.html"'));

put(latest('신도앱_v'), 'member.html', '신도 앱 클릭 프로토타입 (예시 데이터)', (s) =>
  s.replace('</aside>', '  <p class="micro"><a href="admin.html">관리자 웹 프로토타입 보기 →</a> · <a href="./">처음 화면</a></p>\n</aside>'));
