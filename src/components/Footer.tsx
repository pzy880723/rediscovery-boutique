const Footer = () => {
  return (
    <footer className="bg-foreground text-background/70 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <h4 className="font-display text-lg font-bold text-background mb-3">BOOMER OFF</h4>
            <p className="text-sm leading-relaxed">
              宝暮（上海）商贸有限公司
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-background mb-3">联系我们</h4>
            <p className="text-sm mb-1">邮箱：contact@boomeroff.com</p>
            <p className="text-sm">电话：021-XXXX-XXXX</p>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-bold text-background mb-3">关注我们</h4>
            <div className="flex gap-4 text-sm">
              <span className="hover:text-background transition-colors cursor-pointer">微信公众号</span>
              <span className="hover:text-background transition-colors cursor-pointer">小红书</span>
              <span className="hover:text-background transition-colors cursor-pointer">抖音</span>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex gap-4">
            <span className="hover:text-background transition-colors cursor-pointer">隐私政策</span>
            <span className="hover:text-background transition-colors cursor-pointer">用户协议</span>
          </div>
          <p>沪ICP备XXXXXXXX号 © {new Date().getFullYear()} BOOMER OFF. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
