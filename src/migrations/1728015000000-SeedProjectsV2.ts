// src/migrations/1728015000000-SeedProjectsV2.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

type SeedProject = {
    slug: string;
    title: string;
    description: string;
    imageUrl: string | null;
    websiteUrl: string | null;
    category:
    | 'Hospitality'
    | 'Bio Tech'
    | 'Construction'
    | 'Consulting'
    | 'Financial Services'
    | 'IT'
    | 'Legal'
    | 'Medical'
    | 'Nonprofit'
    | 'Product'
    | 'Professional Services'
    | 'Real Estate'
    | 'Technology'
    | 'Tourism Agency';
    isFeatured?: boolean;
    status?: 'draft' | 'published';
    techStack?: string[];
    orderIndex?: number;
};

// ⚠️ зверни увагу: тут уже фінальні значення techStack/links/тощо
const seeds: SeedProject[] = [
    {
        slug: 'dream-voyage',
        title: 'Dream Voyage',
        description:
            "The Dream Voyage Travel Agency specializes in crafting unforgettable travel experiences, offering personalized itineraries, luxury accommodations, and seamless travel planning. Whether it's an exotic getaway, cultural exploration, or adventure-filled journey, we ensure every trip is stress-free and tailored to your desires. ✈️🌍",
        imageUrl:
            'https://res.cloudinary.com/dq0fwucoj/image/upload/v1740570755/Title2_wa53fb_Sharpened_w1svu6.png',
        websiteUrl: 'https://dream-voyage-front.vercel.app/en/',
        category: 'Tourism Agency',
        isFeatured: true,
        status: 'published',
        techStack: [
            'JavaScript',
            'Express.js',
            'Tailwind CSS',
            'Node',
            'HTML5',
            'REST Api',
            'Stripe',
            'MERN',
            'Email.js',
            'React.js',
            'Redux-toolkit',
            'Axios',
            'Mongo DB',
            'JSON',
            'i18n',
            'CRUD',
            'Swiper',
            'Auth (HttpOnly cookies/JWT, RBAC)',
        ],
        orderIndex: 1,
    },
    {
        slug: 'restaurant-app',
        title: 'Restaurant App',
        description:
            'The Restaurant App is a modern platform that allows users to explore menus, make reservations, and order food online with a seamless experience. Designed for efficiency, it offers a user-friendly interface, real-time table availability, and secure payment options. 🍽️📱',
        imageUrl:
            'https://res.cloudinary.com/dq0fwucoj/image/upload/v1740573315/img12_elbj0p_Sharpened_obzo5q.png',
        websiteUrl: 'https://project2-bettina.vercel.app/',
        category: 'Hospitality',
        status: 'published',
        techStack: ['JavaScript', 'React.js', 'CRUD', 'HTML5', 'CSS3', 'Axios', 'JSON', 'Swiper'],
        orderIndex: 2,
    },
    {
        slug: 'who-wants-to-be-a-millionaire',
        title: 'Who wants to be a millionaire',
        description:
            'The Who Wants to Be a Millionaire app is an interactive trivia game that challenges players with a series of multiple-choice questions, increasing in difficulty as they progress. With lifelines, engaging animations, and a competitive leaderboard, it delivers an exciting quiz experience just like the classic TV show. 💰🎉',
        imageUrl:
            'https://res.cloudinary.com/dq0fwucoj/image/upload/v1740574126/millionare_a1ubav_Sharpened_raxucj.png',
        websiteUrl: 'https://who-wants-to-be-a-millionaire-one.vercel.app/',
        category: 'Product',
        status: 'published',
        techStack: ['DOM', 'JSON', 'JavaScript', 'HTML5', 'CSS3', 'OOP', 'Node.js'],
        orderIndex: 3,
    },
    {
        slug: 'medical-service-app',
        title: 'Medical Service App',
        description:
            'The Medical Service App is a secure digital platform that allows users to store, manage, and share their medical records effortlessly. With easy access to prescriptions, appointments, and health history, it ensures seamless communication between patients and healthcare providers. 🏥📄',
        imageUrl:
            'https://res.cloudinary.com/dq0fwucoj/image_upload/v1740677637/img4_krymz4_Sharpened_gebhg2.png'.replace(
                'image_upload',
                'image/upload'
            ), // підстраховка від подвійного "image//upload"
        websiteUrl: 'https://medical-cards-kappa.vercel.app/',
        category: 'Medical',
        status: 'published',
        techStack: ['JavaScript', 'TypeScript', 'HTML5', 'Tailwind CSS', 'CRUD', 'Node.js'],
        orderIndex: 4,
    },
    {
        slug: 'aleksandr-klusbedrijf',
        title: 'Aleksandr Klusbedrijf',
        description:
            'Aleksandr Klusbedrijf is a professional construction and renovation company based in the Netherlands. We specialize in home improvements, interior and exterior renovations, tiling, painting, drywall installation, and general handyman services. Trusted for quality craftsmanship and timely delivery, we turn your ideas into solid results. 🧱🏡',
        imageUrl:
            'https://res.cloudinary.com/dq0fwucoj/image/upload/v1744648462/img_f4p3gd_Sharpened_yqfqwq.png',
        websiteUrl: 'https://alexander-zhyhan.vercel.app/',
        category: 'Construction',
        status: 'published',
        techStack: ['JavaScript', 'TypeScript', 'React', 'HTML5', 'Tailwind CSS', 'Email.js', 'Node.js'],
        orderIndex: 5,
    },
    {
        slug: 'vlagyimir-gyikovec',
        title: 'Vlagyimir Gyikovec',
        description:
            'Vlagyimir Gyikovec is a skilled construction specialist offering a wide range of renovation and repair services across residential and commercial properties. From structural improvements to fine interior finishes, every project is completed with precision, reliability, and attention to detail. Build smart — build with Vlagyimir. 🏗️🔨',
        imageUrl:
            'https://res.cloudinary.com/dq0fwucoj/image/upload/v1744648641/img1_mr0hg9_Sharpened_xpiuwf.png',
        websiteUrl: 'https://vlagyimir-gyikovec.vercel.app/',
        category: 'Construction',
        status: 'published',
        techStack: ['JavaScript', 'TypeScript', 'React', 'HTML5', 'Tailwind CSS', 'Email.js', 'Node.js'],
        orderIndex: 6,
    },
];

export class SeedProjectsV21728015000000 implements MigrationInterface {
    // важливо: name збігається з класом/файлом за таймстемпом
    name = 'SeedProjectsV21728015000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        for (const p of seeds) {
            await queryRunner.query(
                `
        INSERT INTO "projects"
          ("slug","title","description","imageUrl","websiteUrl","category",
           "isFeatured","status","techStack","orderIndex","createdAt","updatedAt")
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::text[],$10, now(), now())
        ON CONFLICT ("slug") DO UPDATE SET
          "title" = EXCLUDED."title",
          "description" = EXCLUDED."description",
          "imageUrl" = EXCLUDED."imageUrl",
          "websiteUrl" = EXCLUDED."websiteUrl",
          "category" = EXCLUDED."category",
          "isFeatured" = EXCLUDED."isFeatured",
          "status" = EXCLUDED."status",
          "techStack" = EXCLUDED."techStack",
          "orderIndex" = EXCLUDED."orderIndex",
          "updatedAt" = now();
        `,
                [
                    p.slug,
                    p.title,
                    p.description,
                    p.imageUrl,
                    p.websiteUrl,
                    p.category,
                    p.isFeatured ?? false,
                    p.status ?? 'published',
                    p.techStack ?? [],
                    p.orderIndex ?? 0,
                ],
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const slugs = seeds.map((s) => s.slug);
        await queryRunner.query(
            `DELETE FROM "projects" WHERE "slug" = ANY($1::text[])`,
            [slugs],
        );
    }
}
