
/** @type {import('next').NextConfig} */
const nextConfig = { eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    images: { domains: ['localhost'], formats: ['image/avif', 'image/webp'], },


};

export default nextConfig;
