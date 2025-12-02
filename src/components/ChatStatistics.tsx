import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  MessageSquare,
  Clock,
  Calendar,
  FileText,
  Globe,
  Activity,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Card } from "./ui/card";
import {
  analyzeConversations,
  ConversationAnalytics,
  getConversationDurations,
} from "../lib/chat/chat-analytics";

interface ChatStatisticsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatStatistics({ isOpen, onClose }: ChatStatisticsProps) {
  const [analytics, setAnalytics] = useState<ConversationAnalytics | null>(
    null
  );
  const [durations, setDurations] = useState<{
    short: number;
    medium: number;
    long: number;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadAnalytics();
    }
  }, [isOpen]);

  const loadAnalytics = () => {
    const data = analyzeConversations();
    const durationData = getConversationDurations();
    setAnalytics(data);
    setDurations(durationData);
  };

  if (!analytics || !durations) {
    return null;
  }

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}${period}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-emerald-600" />
          Conversation Analytics
        </DialogTitle>
        <DialogDescription>
          Insights and statistics from your chat history
        </DialogDescription>

        <div className="space-y-6 py-4">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl text-slate-900 mb-1">
                {analytics.totalConversations}
              </div>
              <div className="text-xs text-slate-500">Total Conversations</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl text-slate-900 mb-1">
                {analytics.totalMessages}
              </div>
              <div className="text-xs text-slate-500">Total Messages</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-2xl text-slate-900 mb-1">
                {analytics.averageMessagesPerConversation}
              </div>
              <div className="text-xs text-slate-500">Avg Messages/Chat</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <FileText className="h-4 w-4 text-orange-600" />
              </div>
              <div className="text-2xl text-slate-900 mb-1">
                {analytics.averageConversationLength}
              </div>
              <div className="text-xs text-slate-500">Avg Words/Chat</div>
            </Card>
          </div>

          {/* Activity Patterns */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-5">
              <h3 className="text-sm text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-600" />
                Activity Patterns
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Most Active Day</span>
                  <span className="text-sm text-slate-900">
                    {analytics.mostActiveDay}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Peak Hour</span>
                  <span className="text-sm text-slate-900">
                    {formatHour(analytics.mostActiveHour)}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-sm text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                Conversation Duration
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Quick (&lt;5 min)</span>
                      <span>{durations.short}</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{
                          width: `${
                            (durations.short / analytics.totalConversations) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Medium (5-30 min)</span>
                      <span>{durations.medium}</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${
                            (durations.medium / analytics.totalConversations) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Long (&gt;30 min)</span>
                      <span>{durations.long}</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500"
                        style={{
                          width: `${
                            (durations.long / analytics.totalConversations) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sources Breakdown */}
          <Card className="p-5">
            <h3 className="text-sm text-slate-900 mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4 text-purple-600" />
              Information Sources
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl text-slate-900">
                    {analytics.sourcesBreakdown.doc}
                  </div>
                  <div className="text-xs text-slate-500">
                    Documentation Sources
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl text-slate-900">
                    {analytics.sourcesBreakdown.web}
                  </div>
                  <div className="text-xs text-slate-500">Web Sources</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Top Topics */}
          {analytics.topTopics.length > 0 && (
            <Card className="p-5">
              <h3 className="text-sm text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                Popular Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {analytics.topTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-full text-xs text-slate-700 flex items-center gap-2"
                  >
                    <span className="capitalize">{topic.topic}</span>
                    <span className="text-emerald-600">
                      {topic.count}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Conversation Trends */}
          {analytics.conversationTrends.length > 0 && (
            <Card className="p-5">
              <h3 className="text-sm text-slate-900 mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                Activity Trend (Last 30 Days)
              </h3>
              <div className="flex items-end gap-1 h-32">
                {analytics.conversationTrends.map((trend, index) => {
                  const maxCount = Math.max(
                    ...analytics.conversationTrends.map((t) => t.count)
                  );
                  const height = (trend.count / maxCount) * 100;
                  return (
                    <div
                      key={index}
                      className="flex-1 bg-gradient-to-t from-emerald-500 to-blue-500 rounded-t hover:opacity-80 transition-opacity group relative"
                      style={{ height: `${height}%`, minHeight: "4px" }}
                      title={`${trend.date}: ${trend.count} conversations`}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {new Date(trend.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        : {trend.count}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>
                  {new Date(
                    analytics.conversationTrends[0].date
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span>
                  {new Date(
                    analytics.conversationTrends[
                      analytics.conversationTrends.length - 1
                    ].date
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
