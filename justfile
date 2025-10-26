dev:
    pnpm dev

build:
    pnpm build

start:
    pnpm start

install:
    pnpm install

clean:
    rm -rf dist node_modules

fmt:
    pnpm exec tsc --noEmit
