import { useEffect, useMemo, useState } from 'react';
import type { Exercise } from '../../lib/data/types';
import { getApi } from '../../lib/data/api';
import { Card, CardHeader, CardTitle, Input } from '../../components';
import { BodyPartAccordion } from './components/BodyPartAccordion';

export function LibraryPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    getApi()
      .then((api) => api.listExercises())
      .then((result) => {
        if (!cancelled) setExercises(result);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return exercises;
    return exercises.filter((e) => {
      return (
        e.name.toLowerCase().includes(q) ||
        e.equipment?.toLowerCase().includes(q) ||
        e.secondaryMuscles?.some((m) => m.toLowerCase().includes(q)) ||
        e.bodyPart.replace('_', ' ').includes(q)
      );
    });
  }, [exercises, query]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Exercise Library</CardTitle>
        </CardHeader>
        <Input
          placeholder="Search by name, equipment, or muscle…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search exercises"
        />
      </Card>

      {loading ? (
        <p className="py-6 text-center text-sm text-text-secondary">Loading exercises…</p>
      ) : exercises.length === 0 ? (
        <p className="py-6 text-center text-sm text-text-secondary">No exercises available yet.</p>
      ) : (
        <BodyPartAccordion exercises={filtered} />
      )}
    </div>
  );
}
