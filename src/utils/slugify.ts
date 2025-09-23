// src/utils/slugify.ts
export function slugifyLatin(input: string): string {
    return input
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

// опційно: проста транслітерація UA/RU → латинка
const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ie', ж: 'zh', з: 'z',
    и: 'y', і: 'i', ї: 'i', й: 'i', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p',
    р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh',
    щ: 'shch', ю: 'iu', я: 'ia', ь: '', ъ: '', ы: 'y', э: 'e'
};
export function translitCyrillicToLatin(input: string): string {
    return input
        .toLowerCase()
        .replace(/[а-яґєіїёъыэ]/gi, ch => map[ch] ?? ch);
}

export function slugifyAny(input: string): string {
    const basic = slugifyLatin(translitCyrillicToLatin(input));
    return basic || 'item';
}
