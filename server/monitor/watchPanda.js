const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  });

  const page = await browser.newPage();

  const broadcastUrl = 'https://www.pandalive.co.kr/play/pandacp';
  await page.goto(broadcastUrl);
  console.log('✅ 방송 페이지 접속 완료');

  await new Promise(resolve => setTimeout(resolve, 20000));
  console.log('🔐 로그인 완료 대기 후 채팅 감시 시작!');

  setInterval(async () => {
    const chatText = await page.evaluate(() => {
      const chatItems = Array.from(document.querySelectorAll('.scrollbar-custom > div'));
      return chatItems.map(el => el.innerText).join('\n');
    });

    if (chatText.includes('하트 선물')) {
      console.log('🎁 하트 선물 감지됨! 채팅창 캡쳐 중...');

      const chatBox = await page.$('.scrollbar-custom');
      if (chatBox) {
        const fileName = `chatbox_${Date.now()}.png`;
        const screenshotPath = path.join(__dirname, fileName);
        await chatBox.screenshot({ path: screenshotPath });
        console.log(`💾 채팅창만 스크린샷 저장 완료: ${fileName}`);
      } else {
        console.log('⚠️ 채팅창 요소를 찾을 수 없어요.');
      }
    }
  }, 5000);
})();
