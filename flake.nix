{
  description = "Telegram bot for Ecma Uzbekistan";

  inputs = {
    # Too old to work with most libraries
    # nixpkgs.url = "github:nixos/nixpkgs/nixos-25.11";

    # Perfect!
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";

    # The flake-utils library
    flake-utils.url = "github:numtide/flake-utils";

    #
    nix-deno.url = "github:nekowinston/nix-deno";

    # https://github.com/NixOS/nixpkgs/pull/453904
    deno-fetcher.url = "github:aMOPel/nixpkgs/feat/fetchDenoDeps";
  };

  outputs = {
    # self,
    nixpkgs,
    flake-utils,
    nix-deno,
    deno-fetcher,
    ...
  }:
    flake-utils.lib.eachDefaultSystem
    (
      system: let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [nix-deno.overlays.default];
        };
      in {
        # Nix script formatter
        formatter = pkgs.alejandra;

        # Development environment
        devShells.default = import ./shell.nix {inherit pkgs;};

        # Output package
        packages.default = let
          vendor =
            (
              deno-fetcher.legacyPackages.${system}.fetchDenoDeps {
                name = "deno-deps";
                denoLock = ./deno.lock;
                hash = "sha256-IwSwQ3NXaaqxnxlHZcrH261CEipfkt0U32o6o5S9NFY=";
              }
            ).denoDeps;

          # we do need denort
          # https://github.com/NixOS/nixpkgs/blob/ddf56acbeb53825b79b82c13a657806774bfd137/pkgs/by-name/de/deno/package.nix#L210
          denoWithRt = pkgs.deno.overrideAttrs {postInstall = "";};
        in
          pkgs.denoPlatform.mkDenoBinary rec {
            name = "telegram";
            version = "0.0.1";
            src = ./.;
            buildInputs = [];
            buildPhase = ''
              mkdir -p "$NIX_BUILD_TOP/src"
              cp -r "$src/." "$NIX_BUILD_TOP/src"
              cp -r "${vendor}/." "$NIX_BUILD_TOP/src"
              cd "$NIX_BUILD_TOP/src"

              DENORT_BIN=${denoWithRt}/bin/denort deno compile ${pkgs.denoPlatform.lib.generateFlags {
                inherit permissions;
                entryPoint = "main.ts";
                additionalDenoArgs = ["--output" name "--vendor=true"];
              }}

              install -Dm755 ${name} $out/bin/${name}
            '';

            installPhase = "";

            permissions.allow.all = true;
          };
      }
    );
  # // {
  #   # Overlay module
  #   nixosModules.bot = import ./module.nix self;
  # };
}
