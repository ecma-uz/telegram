{pkgs ? import <nixpkgs> {}, ...}: let
  lib = pkgs.lib;
in
  pkgs.stdenv.mkDerivation {
    pname = "telegram";
    version = "0.0.1";

    src = ./.;

    buildInputs = with pkgs; [
      deno
    ];

    buildPhase = ''
      deno compile ./mod.ts
    '';

    installPhase = ''
      mkdir -p $out/bin
      echo "something" > $out/bin/something
    '';

    meta = with lib; {
      homepage = "https://ecma.uz";
      description = "Telergam bot of Ecma Uzbekistan";
      platforms = with platforms; darwin ++ linux;
    };
  }
