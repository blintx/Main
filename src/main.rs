use std::process::Command;

fn web() {
    let web_install = Command::new("cmd")
        .args(&["/C", "pnpm", "install"])
        .current_dir("web")
        .status()
        .expect("Sikertelen");
    if web_install.success() {
        Command::new("cmd")
            .args(&["/C", "pnpm", "dev"])
            .current_dir("web")
            .spawn()
            .expect("Sikertelen");
    }
}

fn main() {
    web()
}
