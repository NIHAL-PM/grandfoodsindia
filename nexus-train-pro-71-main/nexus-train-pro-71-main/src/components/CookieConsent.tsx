import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cookie, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLanguage } from '@/context/LanguageContext';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    functionality: false,
  });
  const { t, dir } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem("kaisan_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 2500); // delayed appearance
      return () => clearTimeout(timer);
    }
  }, []);

  const store = (data: any) => {
    localStorage.setItem("kaisan_cookie_consent", JSON.stringify({ ...data, timestamp: new Date().toISOString() }));
  };

  const acceptAll = () => {
    store({ essential: true, analytics: true, marketing: true, functionality: true });
    setShowBanner(false);
  };

  const acceptEssential = () => {
    store({ essential: true, analytics: false, marketing: false, functionality: false });
    setShowBanner(false);
  };

  const savePreferences = () => {
    store(preferences);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-2 left-2 right-2 md:right-4 md:left-auto z-50" dir={dir}>
      <Card className="px-4 py-3 shadow-lg bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85 border-border/60 max-w-sm ml-auto rounded-lg">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-primary"><Cookie className="w-4 h-4" /></div>
          <div className="flex-1 space-y-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('cookie.banner')} <Link to="/cookie-policy" className="text-primary hover:underline ml-1">{t('cookie.policy')}</Link>.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" className="h-7 px-3" onClick={acceptAll}>{t('cookie.acceptAll')}</Button>
              <Button size="sm" variant="outline" className="h-7 px-3" onClick={acceptEssential}>{t('cookie.essentialOnly')}</Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-7 px-3 flex items-center gap-1">
                    <Settings className="w-3 h-3" /> {t('cookie.preferences')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md" dir={dir}>
                  <DialogHeader>
                    <DialogTitle>{t('cookie.preferencesTitle')}</DialogTitle>
                    <DialogDescription>{t('cookie.preferencesDesc')}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-5 py-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="font-medium">{t('cookie.cat.essential')}</Label>
                        <p className="text-xs text-muted-foreground">{t('cookie.cat.required')}</p>
                      </div>
                      <Switch checked disabled />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="font-medium">{t('cookie.cat.analytics')}</Label>
                        <p className="text-xs text-muted-foreground">{t('cookie.cat.analyticsDesc')}</p>
                      </div>
                      <Switch
                        checked={preferences.analytics}
                        onCheckedChange={(checked) => setPreferences(p => ({ ...p, analytics: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="font-medium">{t('cookie.cat.functionality')}</Label>
                        <p className="text-xs text-muted-foreground">{t('cookie.cat.functionalityDesc')}</p>
                      </div>
                      <Switch
                        checked={preferences.functionality}
                        onCheckedChange={(checked) => setPreferences(p => ({ ...p, functionality: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="font-medium">{t('cookie.cat.marketing')}</Label>
                        <p className="text-xs text-muted-foreground">{t('cookie.cat.marketingDesc')}</p>
                      </div>
                      <Switch
                        checked={preferences.marketing}
                        onCheckedChange={(checked) => setPreferences(p => ({ ...p, marketing: checked }))}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 justify-end">
                    <Button variant="outline" onClick={acceptEssential} size="sm">{t('cookie.essentialOnly')}</Button>
                    <Button onClick={savePreferences} size="sm">{t('cookie.save')}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CookieConsent;