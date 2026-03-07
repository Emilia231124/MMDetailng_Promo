'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import ScrollRevealText from '@/components/ui/ScrollRevealText';
import ScrollRevealImage from '@/components/ui/ScrollRevealImage';
import AnimatedSearchBar from '@/components/ui/AnimatedSearchBar';
import CarDetailOverlay, { type CarModel } from '@/components/ui/CarDetailOverlay';

const carModels: CarModel[] = [
  {
    id: 'changan-cs75',
    brand: 'Changan',
    model: 'CS75 Plus',
    year: '2020–2024',
    img: '/images/portfolio/1_.jpg',
    price: 'от 15 000 ₽',
    description: 'Полная русификация мультимедиа и приборной панели.',
    features: ['Мультимедиа', 'Приборная панель', 'Голосовой помощник'],
  },
  {
    id: 'haval-jolion',
    brand: 'Haval',
    model: 'Jolion',
    year: '2021–2024',
    img: '/images/portfolio/2__.jpg',
    price: 'от 12 000 ₽',
    description: 'Русификация головного устройства и панели приборов.',
    features: ['Мультимедиа', 'Приборная панель'],
  },
  {
    id: 'chery-tiggo7',
    brand: 'Chery',
    model: 'Tiggo 7 Pro',
    year: '2020–2024',
    img: '/images/portfolio/3_.jpg',
    price: 'от 14 000 ₽',
    description: 'Мультимедиа, приборка, установка приложений.',
    features: ['Мультимедиа', 'Приборная панель', 'Приложения'],
  },
  {
    id: 'geely-coolray',
    brand: 'Geely',
    model: 'Coolray',
    year: '2020–2024',
    img: '/images/portfolio/4_.jpg',
    price: 'от 13 000 ₽',
    description: 'Русификация системы и голосового управления.',
    features: ['Мультимедиа', 'Голосовой помощник'],
  },
  {
    id: 'exeed-txl',
    brand: 'Exeed',
    model: 'TXL',
    year: '2021–2024',
    img: '/images/portfolio/5_.jpg',
    price: 'от 16 000 ₽',
    description: 'Полная русификация всех систем.',
    features: ['Мультимедиа', 'Приборная панель', 'Голосовой помощник', 'Приложения'],
  },
  {
    id: 'omoda-c5',
    brand: 'Omoda',
    model: 'C5',
    year: '2023–2024',
    img: '/images/portfolio/6_.jpg',
    price: 'от 14 000 ₽',
    description: 'Русификация мультимедиа и установка приложений.',
    features: ['Мультимедиа', 'Приложения'],
  },
  {
    id: 'tank-300',
    brand: 'Tank',
    model: '300',
    year: '2022–2024',
    img: '/images/portfolio/7_.jpg',
    price: 'от 18 000 ₽',
    description: 'Комплексная русификация для Tank 300.',
    features: ['Мультимедиа', 'Приборная панель', 'Голосовой помощник'],
  },
  {
    id: 'jetour-dashing',
    brand: 'Jetour',
    model: 'Dashing',
    year: '2023–2024',
    img: '/images/portfolio/8_.jpg',
    price: 'от 15 000 ₽',
    description: 'Русификация головного устройства.',
    features: ['Мультимедиа', 'Приборная панель'],
  },
];

export default function RussificationContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCar, setSelectedCar] = useState<CarModel | null>(null);

  const filteredCars = carModels.filter((car) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      car.brand.toLowerCase().includes(q) ||
      car.model.toLowerCase().includes(q) ||
      `${car.brand} ${car.model}`.toLowerCase().includes(q)
    );
  });

  // Блокировка скролла при открытом модале
  useEffect(() => {
    document.body.style.overflow = selectedCar ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCar]);

  const openModal = useCallback((car: CarModel) => setSelectedCar(car), []);
  const closeModal = useCallback(() => setSelectedCar(null), []);

  return (
    <main style={{ background: '#050505', minHeight: '100vh' }}>
      {/* Отступ под header */}
      <div style={{ height: '80px' }} aria-hidden />

      {/* Заголовок — как на /services */}
      <section style={{ paddingTop: '140px', paddingBottom: '80px' }}>
        <div className="services-page-container">
          <ScrollRevealText
            as="h1"
            splitBy="words"
            stagger={0.08}
            className="font-display text-[clamp(2.5rem,6vw,5rem)] font-bold uppercase leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)]"
          >
            Русификация авто
          </ScrollRevealText>

          <ScrollRevealText
            as="p"
            splitBy="words"
            stagger={0.03}
            delay={0.5}
            className="mt-8 max-w-[65%] font-body text-[clamp(18px,1.5vw,21px)] leading-relaxed text-[var(--text-secondary)]"
          >
            Русификация мультимедиа, приборной панели и голосового помощника.
            Найдите свою модель и узнайте стоимость.
          </ScrollRevealText>
        </div>
      </section>

      {/* Поисковая строка */}
      <section style={{ paddingBottom: '60px' }}>
        <div className="services-page-container">
          <AnimatedSearchBar
            label="Найдите свою модель"
            placeholder="Changan, Haval, Chery…"
            onSearch={setSearchQuery}
          />
        </div>
      </section>

      {/* Каталог автомобилей */}
      <section style={{ paddingBottom: 'clamp(100px, 15vh, 200px)' }}>
        <div className="services-page-container">
          {filteredCars.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: 'clamp(16px, 2vw, 32px)',
              }}
            >
              {filteredCars.map((car) => (
                <ScrollRevealImage key={car.id}>
                  <div
                    onClick={() => openModal(car)}
                    style={{ cursor: 'pointer' }}
                    className="group"
                  >
                    {/* Фото — фиксированное соотношение 3:2, без border-radius */}
                    <div style={{ position: 'relative', aspectRatio: '3/2', overflow: 'hidden' }}>
                      <Image
                        src={car.img}
                        alt={`${car.brand} ${car.model}`}
                        fill
                        style={{
                          objectFit: 'cover',
                          transition: 'opacity 0.3s',
                        }}
                        className="group-hover:opacity-70"
                      />
                    </div>

                    {/* Название под фото */}
                    <div style={{ marginTop: '12px' }}>
                      <span
                        style={{
                          fontSize: 'clamp(14px, 1.1vw, 18px)',
                          fontWeight: 700,
                          color: '#fff',
                          fontFamily: 'var(--font-display)',
                          textTransform: 'uppercase',
                          display: 'block',
                          lineHeight: 1.2,
                        }}
                      >
                        {car.brand} {car.model}
                      </span>
                      {car.year && (
                        <span
                          style={{
                            fontSize: '11px',
                            color: '#555',
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '0.1em',
                            display: 'block',
                            marginTop: '4px',
                          }}
                        >
                          {car.year}
                        </span>
                      )}
                    </div>
                  </div>
                </ScrollRevealImage>
              ))}
            </div>
          ) : (
            <p
              style={{
                color: '#555',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                textAlign: 'center',
                padding: '80px 0',
                letterSpacing: '0.1em',
              }}
            >
              Модель не найдена
            </p>
          )}
        </div>
      </section>

      {/* Overlay-модал */}
      <CarDetailOverlay car={selectedCar} onClose={closeModal} />
    </main>
  );
}
