'use client';
import { usePolygonStore, type ColorRule } from '@/store/usePolygonStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from './ui/button';
import { Trash2, Plus } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import PolygonList from './PolygonList';
import { Label } from './ui/label';

export default function PolygonManager() {
  const {
    polygons,
    activePolygonId,
    updatePolygonRules,
    updatePolygonDataSource
  } = usePolygonStore();
  
  const activePolygon = activePolygonId ? polygons[activePolygonId] : null;

  const handleAddRule = () => {
    if (!activePolygon) return;
    const newRule: ColorRule = {
      id: crypto.randomUUID(),
      condition: 'lt',
      value: 0,
      color: '#0000ff', // Default to blue
    };
    const newRules = [...activePolygon.rules, newRule];
    updatePolygonRules(activePolygon.id, newRules);
  };

  const handleUpdateRule = (ruleId: string, field: keyof ColorRule, value: any) => {
    if (!activePolygon) return;
    const newRules = activePolygon.rules.map((rule) =>
      rule.id === ruleId ? { ...rule, [field]: value } : rule
    );
    updatePolygonRules(activePolygon.id, newRules);
  };

  const handleRemoveRule = (ruleId: string) => {
    if (!activePolygon) return;
    const newRules = activePolygon.rules.filter((rule) => rule.id !== ruleId);
    updatePolygonRules(activePolygon.id, newRules);
  };

  return (
    <div className="p-4 space-y-4">
      <PolygonList />

      {activePolygon && (
        <Card>
          <CardHeader>
            <CardTitle>Polygon Controls</CardTitle>
            <CardDescription>
              ID: <span className="font-mono text-xs">{activePolygon.id}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Data Source</Label>
              <Select 
                value={activePolygon.dataSource} 
                onValueChange={(value) => updatePolygonDataSource(activePolygon.id, value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temperature_2m">Temperature (2m)</SelectItem>
                  <SelectItem value="relative_humidity_2m">Relative Humidity (2m)</SelectItem>
                  <SelectItem value="precipitation">Precipitation</SelectItem>
                  <SelectItem value="cloud_cover">Cloud Cover</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator/>
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Color Rules</h4>
                <Button onClick={handleAddRule} size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Rule
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Current average: {activePolygon.currentAverage?.toFixed(2) ?? 'N/A'}
              </p>
              <ScrollArea className="h-64">
                  <div className="space-y-3 pr-4">
                  {activePolygon.rules.map((rule) => (
                      <div key={rule.id} className="grid grid-cols-12 gap-2 items-center">
                      <span className="col-span-3 text-sm">If value is</span>
                      <Select
                          value={rule.condition}
                          onValueChange={(val: 'lt' | 'gt' | 'eq') => handleUpdateRule(rule.id, 'condition', val)}
                      >
                          <SelectTrigger className="col-span-3">
                          <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                          <SelectItem value="lt">{'<'}</SelectItem>
                          <SelectItem value="gt">{'>'}</SelectItem>
                          <SelectItem value="eq">{'='}</SelectItem>
                          </SelectContent>
                      </Select>
                      <Input
                          type="number"
                          value={rule.value}
                          onChange={(e) => handleUpdateRule(rule.id, 'value', parseFloat(e.target.value))}
                          className="col-span-2"
                      />
                      <Input
                          type="color"
                          value={rule.color}
                          onChange={(e) => handleUpdateRule(rule.id, 'color', e.target.value)}
                          className="col-span-2 p-1"
                      />
                      <Button
                          variant="ghost"
                          size="icon"
                          className="col-span-2 h-8 w-8"
                          onClick={() => handleRemoveRule(rule.id)}
                      >
                          <Trash2 className="h-4 w-4" />
                      </Button>
                      </div>
                  ))}
                  {activePolygon.rules.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-4">No color rules defined.</p>
                  )}
                  </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
