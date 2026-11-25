import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const url = process.env.QA_URL || 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
const page = await context.newPage();
const results = [];
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await mkdir('qa/screenshots', { recursive: true });
async function test(name, run) {
  try { await run(); results.push({ name, result: 'PASS' }); }
  catch (error) { results.push({ name, result: 'FAIL', reason: error.message }); }
}
const loaded = () => page.locator('h1').waitFor();
await page.goto(url); await loaded();
await test('Arabic default, honest content and optional assets', async () => {
  assert.equal(await page.locator('html').getAttribute('lang'), 'ar');
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  assert.equal(await page.locator('.project-card').count(), 3);
  assert.equal(await page.locator('.service-card').count(), 6);
  assert.equal(await page.locator('.skill-pills span').count(), 9);
  assert.equal(await page.locator('a[download]').count(), 0);
  assert.equal(await page.locator('a[href*="linkedin"]').count(), 0);
  assert.equal(await page.locator('.identity-monogram').textContent(), 'LM.');
  assert.equal(await page.locator('.project-cover-note').count(), 3);
  assert.equal(await page.locator('.tags').count(), 0);
  assert.ok((await page.title()).includes('لؤي محمد الظاهري'));
});
for (const locale of ['ar', 'en']) for (const theme of ['dark', 'light']) for (const width of [320, 375, 390, 768, 1024, 1440]) {
  await test(`Responsive ${locale}/${theme}/${width}`, async () => {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(({ locale, theme }) => { localStorage.setItem('portfolio-locale', locale); localStorage.setItem('portfolio-theme', theme); }, { locale, theme });
    await page.reload(); await loaded();
    await page.evaluate(() => document.fonts.ready);
    for (const section of await page.locator('main section').all()) { await section.scrollIntoViewIfNeeded(); }
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    assert.equal(await page.locator('html').getAttribute('lang'), locale);
    assert.equal(await page.locator('html').getAttribute('dir'), locale === 'ar' ? 'rtl' : 'ltr');
    const overflow = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth,
      offenders: [...document.querySelectorAll('main *,header *,footer *')].filter(el => {
        const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
        return r.width > 0 && s.visibility !== 'hidden' && s.display !== 'none' && (r.left < -1 || r.right > innerWidth + 1);
      }).map(el => `${el.tagName}.${el.className}`).slice(0, 12) }));
    assert.ok(overflow.document <= width + 1 && !overflow.offenders.length, JSON.stringify(overflow));
    assert.equal(await page.locator('img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0)), true);
    if ([390, 1440].includes(width)) {
      await page.screenshot({ path: `qa/screenshots/${locale}-${theme}-${width}.png`, fullPage: true, animations: 'disabled' });
      if (locale === 'ar' && theme === 'dark') await page.screenshot({ path: `qa/screenshots/hero-${width}.png`, animations: 'disabled' });
    }
  });
}
await page.setViewportSize({ width: 1440, height: 900 });
await test('Language/theme controls and persistence', async () => {
  await page.getByRole('button', { name: 'التبديل إلى العربية' }).click();
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
  await page.getByRole('button', { name: 'تفعيل الوضع الداكن' }).click();
  await page.reload(); await loaded();
  assert.equal(await page.locator('html').getAttribute('lang'), 'ar');
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.getByRole('button', { name: 'Switch to English' }).click();
});
await test('Filters distinguish training work', async () => {
  await page.getByRole('button', { name: 'Training', exact: true }).click();
  assert.equal(await page.locator('.project-card').count(), 1);
  assert.match(await page.locator('.project-card').innerText(), /Phone Repair Management Platform/);
  assert.equal(await page.getByRole('button', { name: 'Training', exact: true }).getAttribute('aria-pressed'), 'true');
  await page.getByRole('button', { name: 'Projects', exact: true }).click();
  assert.equal(await page.locator('.project-card').count(), 2);
  await page.getByRole('button', { name: 'All', exact: true }).click();
});
await test('Modal: all projects, focus trap, Escape, restore, backdrop, close', async () => {
  for (const card of await page.locator('.project-card').all()) {
    const opener = card.getByRole('button', { name: 'View details', exact: true });
    await opener.click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible' });
    assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
    assert.equal(await page.getByRole('button', { name: 'Close details' }).evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement)), true);
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement)), true);
    assert.equal(await dialog.locator('a').count(), 0);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('dialog').count(), 0);
    assert.equal(await opener.evaluate(el => el === document.activeElement), true);
    assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
  }
  await page.locator('.project-card .text-link').first().click();
  await page.getByRole('button', { name: 'Close details' }).click();
  assert.equal(await page.locator('dialog').count(), 0);
  await page.locator('.project-card .text-link').first().click();
  await page.mouse.click(5, 5);
  assert.equal(await page.locator('dialog').count(), 0);
});
await test('Contact links, safe targets, navigation anchors', async () => {
  for (const link of await page.locator('a[target="_blank"]').all()) {
    assert.equal(await link.getAttribute('rel'), 'noopener noreferrer');
    assert.match(await link.getAttribute('href'), /^https:\/\//);
  }
  assert.equal(await page.locator('a[href="https://wa.me/97471438712"]').count(), 2);
  assert.equal(await page.locator('a[href="https://github.com/loaymohammed990-afk"]').count(), 2);
  assert.ok(await page.locator('a[href="mailto:info@loay-mohd.pro"]').count() >= 2);
  assert.equal(await page.locator('a[href="#"]').count(), 0);
  for (const link of await page.locator('nav a').all()) {
    await link.click();
    const target = await link.getAttribute('href');
    await page.locator(target).waitFor();
  }
});
await test('Form validation, clipboard and encoded mailto (no email sent)', async () => {
  await page.getByRole('button', { name: 'Copy message', exact: true }).click();
  assert.equal(await page.locator('form').evaluate(form => form.checkValidity()), false);
  await page.getByLabel('Full name', { exact: true }).fill('QA & تجربة');
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('qa@example.com');
  await page.getByLabel('Your message', { exact: true }).fill('A message with & + ? and العربية.');
  await page.getByRole('button', { name: 'Copy message', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Message copied' }).waitFor();
  assert.match(await page.evaluate(() => navigator.clipboard.readText()), /A message with & \+ \? and العربية\./);
  // Observe the browser's mailto intent in headless Chrome; this does not send mail.
  const navigations = [];
  const record = request => { if (request.url().startsWith('mailto:')) navigations.push(request.url()); };
  page.on('request', record);
  const cdp = await context.newCDPSession(page);
  await cdp.send('Page.enable');
  cdp.on('Page.frameRequestedNavigation', data => { if (data.url.startsWith('mailto:')) navigations.push(data.url); });
  await page.getByRole('button', { name: 'Open email app', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Your message is prepared' }).waitFor();
  assert.ok(navigations.some(value => value.includes('mailto:info@loay-mohd.pro?subject=') && decodeURIComponent(value).includes('QA & تجربة')), 'mailto navigation must be observed');
  page.off('request', record); await cdp.detach();
  await context.clearPermissions();
  await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('Denied')) } }); });
  await page.getByRole('button', { name: 'Copy message', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Automatic copy failed' }).waitFor();
  assert.equal(await page.locator('.draft-preview').getAttribute('open'), '');
});
await test('Mobile menu: keyboard, Escape, close after navigation', async () => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.locator('nav').waitFor({ state: 'visible' });
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('button', { name: 'Open menu' }).evaluate(el => el === document.activeElement), true);
  await page.keyboard.press('Enter');
  await page.locator('nav').getByRole('link', { name: 'Projects' }).click();
  assert.equal(await page.locator('nav').isVisible(), false);
});
await test('Reduced motion', async () => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.locator('.code-window').evaluate(el => getComputedStyle(el).animationName), 'none');
  assert.equal(await page.locator('html').evaluate(el => getComputedStyle(el).scrollBehavior), 'auto');
});
await test('Keyboard skip link', async () => {
  await page.reload(); await loaded();
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('.skip-link').evaluate(el => el === document.activeElement), true);
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('main').evaluate(el => el === document.activeElement), true);
});
for (const locale of ['ar', 'en']) for (const theme of ['dark', 'light']) {
  await test(`Accessibility WCAG 2.1 AA ${locale}/${theme}`, async () => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.evaluate(({ locale, theme }) => { localStorage.setItem('portfolio-locale', locale); localStorage.setItem('portfolio-theme', theme); }, { locale, theme });
    await page.reload(); await loaded();
    for (const section of await page.locator('main section').all()) await section.scrollIntoViewIfNeeded();
    const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    await writeFile(`qa/axe-${locale}-${theme}.json`, JSON.stringify(scan.violations, null, 2));
    assert.equal(scan.violations.length, 0, JSON.stringify(scan.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))));
  });
}
await test('Storage unavailable: graceful fallback', async () => {
  const isolated = await browser.newContext();
  await isolated.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } });
  });
  const tab = await isolated.newPage();
  await tab.goto(url); await tab.locator('h1').waitFor();
  assert.equal(await tab.locator('html').getAttribute('lang'), 'ar');
  await tab.getByRole('button', { name: 'Switch to English' }).click();
  assert.equal(await tab.locator('html').getAttribute('lang'), 'en');
  await isolated.close();
});
await test('No uncaught JavaScript errors', async () => assert.deepEqual(errors, []));
await writeFile('qa/results.json', JSON.stringify({ url, browser: browser.version(), results, errors }, null, 2));
console.log(JSON.stringify(results, null, 2));
await browser.close();
if (results.some(item => item.result === 'FAIL')) process.exitCode = 1;

