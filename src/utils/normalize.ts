interface Package {
  name: string;
  desc: string;
  repo: string;
  arch: string;
  url?: string;
  type: string;
}

const normalize = (pack: Package): string => {
  if (pack.type === "aur") {
    if (pack.url) return pack.url;
    else return `https://aur.archlinux.org/packages/${pack.name}`;
  }

  if (pack.type === "std") {
    if (pack.url) return pack.url;
    else {
      return `https://archlinux.org/packages/${pack.repo}/${pack.arch}/${pack.name}`;
    }
  }

  return "https://archlinux.org/";
};

export default normalize;
