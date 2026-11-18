'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  FiUpload,
  FiZap,
  FiTag,
  FiShoppingBag,
  FiCheck,
  FiCheckCircle,
  FiArrowRight,
  FiUsers,
  FiArchive,
} from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Select from '@/components/ui/Select';
import LoadingState from '@/components/ui/LoadingState';
import SectionHeader from '@/components/ui/SectionHeader';
import MarketOpportunities from './MarketOpportunities';
import { productService, type SavedProduct } from '@/services/product.service';
import { ApiRequestError } from '@/services/api';
import { formatINR } from '@/lib/format';
import type { ProductResult } from '@/types/product';
import './CatalogView.css';

export default function CatalogView() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [products, setProducts] = useState<{ key: string; productName: string }[]>([]);
  const [selected, setSelected] = useState('bamboo-basket');
  const [result, setResult] = useState<ProductResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [saved, setSaved] = useState(false);
  const [myProducts, setMyProducts] = useState<SavedProduct[]>([]);

  const refreshMine = () => {
    productService
      .mine()
      .then((r) => setMyProducts(r.products))
      .catch(() => setMyProducts([]));
  };

  useEffect(() => {
    productService
      .list()
      .then((r) => setProducts(r.products))
      .catch(() => setProducts([]));
    refreshMine();
  }, []);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    setLoading(true);
    setError('');
    try {
      const r = await productService.analyze({ productKey: selected });
      setResult(r);
      setSaved(Boolean(r.saved));
      refreshMine();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Unable to analyze product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="catalog">
      <Card className="catalog__uploader">
        <div className="catalog__upload-zone" onClick={() => fileRef.current?.click()}>
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Product preview" className="catalog__preview" />
          ) : (
            <div className="catalog__upload-placeholder">
              <FiUpload />
              <span>Upload a product photo</span>
              <small>Or continue with a demo product below</small>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFile}
            style={{ display: 'none' }}
          />
        </div>

        <div className="catalog__controls">
          <Select
            label="Demo product"
            options={products.map((p) => ({ value: p.key, label: p.productName }))}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          />
          <p className="catalog__demo-note">
            Demo mode: the uploaded image is previewed, and product details are generated from
            structured demo data. A real vision API can be connected through the same service.
          </p>
          <Button loading={loading} leftIcon={<FiZap />} onClick={analyze} fullWidth>
            Generate Product Details
          </Button>
          {error && <p className="catalog__error">{error}</p>}
        </div>
      </Card>

      {loading && !result ? (
        <LoadingState message="Analyzing product and generating listing..." />
      ) : result ? (
        <>
          <Card className="catalog__result">
            <div className="catalog__result-head">
              <div>
                <div className="catalog__result-badges">
                  <Badge variant="primary" icon={<FiShoppingBag />}>
                    {result.category}
                  </Badge>
                  {saved && (
                    <Badge variant="success" icon={<FiCheckCircle />}>
                      Saved to your catalog
                    </Badge>
                  )}
                </div>
                <h3 className="catalog__product-name">{result.productName}</h3>
              </div>
              <div className="catalog__price">
                <span className="catalog__price-label">Suggested Price</span>
                <span className="catalog__price-value">
                  {formatINR(result.suggestedPriceMin)} – {formatINR(result.suggestedPriceMax)}
                </span>
              </div>
            </div>

            <div className="catalog__lang-toggle">
              <button
                className={lang === 'en' ? 'active' : ''}
                onClick={() => setLang('en')}
              >
                English
              </button>
              <button
                className={lang === 'hi' ? 'active' : ''}
                onClick={() => setLang('hi')}
              >
                हिंदी
              </button>
            </div>
            <p className="catalog__description">
              {lang === 'en' ? result.description : result.descriptionHindi}
            </p>

            <div className="catalog__tags">
              {result.tags.map((t) => (
                <span key={t} className="catalog__tag">
                  <FiTag /> {t}
                </span>
              ))}
            </div>

            <div className="catalog__highlights">
              {result.highlights.map((h) => (
                <span key={h} className="catalog__highlight">
                  <FiCheck /> {h}
                </span>
              ))}
            </div>
          </Card>

          <div className="catalog__market">
            <SectionHeader
              eyebrow="Market Linkage"
              icon={<FiUsers />}
              title="Potential Market Opportunities"
              subtitle="What to sell → how to present it → where potential buyers may exist."
            />
            <MarketOpportunities opportunities={result.marketOpportunities} />
          </div>

          <div className="catalog__next">
            <Link href="/simulator">
              <Button variant="outline" rightIcon={<FiArrowRight />}>
                Try the What-If Simulator
              </Button>
            </Link>
          </div>
        </>
      ) : null}

      {myProducts.length > 0 && (
        <div className="catalog__saved">
          <SectionHeader
            eyebrow="Your Catalog"
            icon={<FiArchive />}
            title="My Products"
            subtitle="Product listings saved to your account."
          />
          <div className="catalog__saved-grid">
            {myProducts.map((p) => (
              <Card key={p.id} className="catalog__saved-item">
                <div className="catalog__saved-item-head">
                  <Badge variant="neutral" size="sm">
                    {p.category}
                  </Badge>
                  <span className="catalog__saved-price">{p.suggestedPrice}</span>
                </div>
                <h4 className="catalog__saved-name">{p.productName}</h4>
                <div className="catalog__saved-tags">
                  {p.tags.slice(0, 4).map((t) => (
                    <span key={t} className="catalog__saved-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
