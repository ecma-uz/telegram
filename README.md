<p align="center">
    <img src=".github/assets/header.png" alt="Ecma Uzbekistan's {Telegram}">
</p>

<p align="center">
    <h3 align="center">Telegram bot for managing all sub-communities.</h3>
</p>

<p align="center">
    <img align="center" src="https://img.shields.io/github/languages/top/ecma-uz/telegram?style=flat&logo=javascript&logoColor=ffffff&labelColor=00AC5B&color=00AC5B" alt="Top Used Language">
</p>

## About

Ecma Uzbekistan consists of sub-communities which needs moderation tools like telegram bots. Therefore, it was decided to implement a single telegram bot for all sub-communities to moderate, manage and provide.

## Development

This project has everything configured ready to get started with developer right away thanks to Nix package manager. In order to get started:

This file defines all required environment variables and runtime settings.

```toml
# Telegram bot token (required)
token = "7635793249:AAGijQ5I210aJVLRv-jR63Q6hFS5uCJQyfU"

# Deployment mode: "polling" or "webhook"
mode = "polling"

# Webhook / local server settings
host = "127.0.0.1"
port = 8000

# Optional admin or chat configuration
admin_user_id = 8118668411
home_chat_id = ""

# Notes:
# - When using "polling", you can keep host = "127.0.0.1"
# - When using "webhook", set `host` to your public HTTPS endpoint (e.g. ngrok or VPS domain)
```


```bash
# Start development environment
nix develop -c $SHELL

# Open favorite editor of your choice
zed .

# Start development server
just start
```

## Building

This project aims to build standalone javascript and deployed in [Kolyma Labs](https://github.com/kolyma-labs). Kolyma's NixOS server gets `nix build` output, but you can build it inside development environment using `npm` package manager.

```bash
# Building with nix`
nix build .

# Building with npm
npm run build
```

## Thanks

- [Orzklv](https://github.com/orzklv) - Bootstraping this project + devops management.
- [Diyorbek](https://github.com/diyorbekrustamjonov) - Maintaining this website keeping it active and up to date.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<p align="center">
    <img src=".github/assets/footer.png" alt="Ecma Uzbekistan's {Telegram}">
</p>
