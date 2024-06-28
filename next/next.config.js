/** @type {import('next').NextConfig} */
const withCSS = require("@zeit/next-css");
const withTM = require('next-transpile-modules')(['antd'])

const nextConfig = {
    transpilePackages: ['readyui', 'antd'],   webpack5: false,  cssModules: true,


};

module.exports = withTM(withCSS(nextConfig));
