'use client';
import { usePolygonStore } from '@/store/usePolygonStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from './ui/button';
import { Trash2, Palette } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { useMapboxDraw } from '@/hooks/useMapboxDraw';

export default function PolygonList() {
  const { polygons, activePolygonId, setActivePolygonId, removePolygon } = usePolygonStore();
  const { removeDrawFeature } = useMapboxDraw();

  const polygonList = Object.values(polygons);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Polygons</CardTitle>
        <CardDescription>
          {polygonList.length > 0 ? 'Select a polygon to manage its rules.' : 'Draw a polygon on the map to begin.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48">
          <div className="space-y-2">
            {polygonList.map((p) => (
              <div
                key={p.id}
                onClick={() => setActivePolygonId(p.id)}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                  activePolygonId === p.id ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" style={{ color: p.color }} />
                  <span className="font-mono text-xs">ID: {p.id.substring(0, 8)}...</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDrawFeature(p.id);
                    removePolygon(p.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
             {polygonList.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">No polygons drawn yet.</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}