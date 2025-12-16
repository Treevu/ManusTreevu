/**
 * InterventionTracker Component
 * 
 * Displays active intervention progress with timeline,
 * milestones, and completion tracking
 * 
 * Usage:
 * <InterventionTracker
 *   intervention={intervention}
 *   onUpdate={() => handleUpdate()}
 *   onComplete={() => handleComplete()}
 * />
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  completedDate?: Date;
}

export interface Intervention {
  id: string;
  type: 'education' | 'goals' | 'offers' | 'counseling' | 'manager_alert';
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'paused' | 'completed' | 'failed';
  progress: number; // 0-100
  milestones: Milestone[];
  estimatedROI: number;
  actualROI?: number;
}

export interface InterventionTrackerProps {
  intervention: Intervention;
  onUpdate?: () => void;
  onComplete?: () => void;
  onPause?: () => void;
  theme?: 'light' | 'dark';
}

const INTERVENTION_COLORS = {
  education: '#2196F3',
  goals: '#4CAF50',
  offers: '#FF9800',
  counseling: '#9C27B0',
  manager_alert: '#F44336',
};

const INTERVENTION_ICONS = {
  education: '📚',
  goals: '🎯',
  offers: '🎁',
  counseling: '💬',
  manager_alert: '⚠️',
};

const STATUS_COLORS = {
  active: '#4CAF50',
  paused: '#FF9800',
  completed: '#2196F3',
  failed: '#F44336',
};

export const InterventionTracker: React.FC<InterventionTrackerProps> = ({
  intervention,
  onUpdate,
  onComplete,
  onPause,
  theme = 'light',
}) => {
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(new Set());
  const interventionColor = INTERVENTION_COLORS[intervention.type];
  const interventionIcon = INTERVENTION_ICONS[intervention.type];
  const statusColor = STATUS_COLORS[intervention.status];

  const toggleMilestone = (id: string) => {
    setExpandedMilestones((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const completedMilestones = intervention.milestones.filter((m) => m.completed).length;
  const totalMilestones = intervention.milestones.length;
  const daysRemaining = Math.ceil(
    (intervention.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { backgroundColor: interventionColor }]}>
        <View style={styles.headerTop}>
          <Text style={styles.interventionIcon}>{interventionIcon}</Text>
          <View style={styles.headerInfo}>
            <Text style={styles.interventionType}>{intervention.type}</Text>
            <Text style={styles.interventionTitle}>{intervention.title}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{intervention.status}</Text>
          </View>
        </View>

        <Text style={styles.description}>{intervention.description}</Text>
      </View>

      <View style={[styles.content, { backgroundColor: theme === 'light' ? '#fff' : '#1a1a1a' }]}>
        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, { color: theme === 'light' ? '#000' : '#fff' }]}>
              Overall Progress
            </Text>
            <Text style={[styles.progressPercent, { color: interventionColor }]}>
              {intervention.progress}%
            </Text>
          </View>

          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: `${intervention.progress}%`,
                  backgroundColor: interventionColor,
                },
              ]}
            />
          </View>

          <View style={styles.progressDetails}>
            <View style={styles.progressDetail}>
              <Text style={[styles.detailLabel, { color: theme === 'light' ? '#666' : '#aaa' }]}>
                Milestones
              </Text>
              <Text style={[styles.detailValue, { color: theme === 'light' ? '#000' : '#fff' }]}>
                {completedMilestones}/{totalMilestones}
              </Text>
            </View>

            <View style={styles.progressDetail}>
              <Text style={[styles.detailLabel, { color: theme === 'light' ? '#666' : '#aaa' }]}>
                Time Remaining
              </Text>
              <Text style={[styles.detailValue, { color: theme === 'light' ? '#000' : '#fff' }]}>
                {daysRemaining} days
              </Text>
            </View>

            <View style={styles.progressDetail}>
              <Text style={[styles.detailLabel, { color: theme === 'light' ? '#666' : '#aaa' }]}>
                Est. ROI
              </Text>
              <Text style={[styles.detailValue, { color: '#4CAF50' }]}>
                ${intervention.estimatedROI.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Milestones Section */}
        <View style={styles.milestonesSection}>
          <Text style={[styles.sectionTitle, { color: theme === 'light' ? '#000' : '#fff' }]}>
            Milestones
          </Text>

          {intervention.milestones.map((milestone, index) => (
            <MilestoneItem
              key={milestone.id}
              milestone={milestone}
              isExpanded={expandedMilestones.has(milestone.id)}
              onToggle={() => toggleMilestone(milestone.id)}
              isLast={index === intervention.milestones.length - 1}
              theme={theme}
              interventionColor={interventionColor}
            />
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {intervention.status === 'active' && (
            <>
              <TouchableOpacity
                style={[styles.button, styles.pauseButton]}
                onPress={onPause}
              >
                <Text style={styles.buttonText}>Pause</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.completeButton, { backgroundColor: interventionColor }]}
                onPress={onComplete}
              >
                <Text style={styles.completeButtonText}>Mark Complete</Text>
              </TouchableOpacity>
            </>
          )}

          {intervention.status === 'paused' && (
            <TouchableOpacity
              style={[styles.button, styles.resumeButton, { backgroundColor: interventionColor }]}
              onPress={onUpdate}
            >
              <Text style={styles.resumeButtonText}>Resume</Text>
            </TouchableOpacity>
          )}

          {intervention.status === 'completed' && (
            <View style={[styles.completedBanner, { backgroundColor: '#E8F5E9' }]}>
              <Text style={styles.completedText}>✓ Intervention Completed</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

interface MilestoneItemProps {
  milestone: Milestone;
  isExpanded: boolean;
  onToggle: () => void;
  isLast: boolean;
  theme: 'light' | 'dark';
  interventionColor: string;
}

const MilestoneItem: React.FC<MilestoneItemProps> = ({
  milestone,
  isExpanded,
  onToggle,
  isLast,
  theme,
  interventionColor,
}) => {
  const daysUntilDue = Math.ceil(
    (milestone.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const isOverdue = daysUntilDue < 0 && !milestone.completed;

  return (
    <View style={styles.milestoneContainer}>
      <TouchableOpacity style={styles.milestoneHeader} onPress={onToggle}>
        <View style={styles.milestoneCheckbox}>
          {milestone.completed ? (
            <View style={[styles.checkboxChecked, { backgroundColor: interventionColor }]}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          ) : (
            <View
              style={[
                styles.checkboxUnchecked,
                { borderColor: isOverdue ? '#F44336' : '#ccc' },
              ]}
            />
          )}
        </View>

        <View style={styles.milestoneInfo}>
          <Text
            style={[
              styles.milestoneTitle,
              {
                color: theme === 'light' ? '#000' : '#fff',
                textDecorationLine: milestone.completed ? 'line-through' : 'none',
              },
            ]}
          >
            {milestone.title}
          </Text>
          <Text
            style={[
              styles.milestoneDueDate,
              {
                color: isOverdue ? '#F44336' : theme === 'light' ? '#666' : '#aaa',
              },
            ]}
          >
            {milestone.completed
              ? `Completed ${milestone.completedDate?.toLocaleDateString()}`
              : isOverdue
              ? `Overdue by ${Math.abs(daysUntilDue)} days`
              : `Due in ${daysUntilDue} days`}
          </Text>
        </View>

        <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={[styles.milestoneDetails, { backgroundColor: theme === 'light' ? '#f9f9f9' : '#2a2a2a' }]}>
          <Text style={[styles.detailsText, { color: theme === 'light' ? '#333' : '#ddd' }]}>
            {milestone.description}
          </Text>
        </View>
      )}

      {!isLast && <View style={styles.milestoneLine} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  interventionIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  interventionType: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 2,
  },
  interventionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  content: {
    padding: 16,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressDetail: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  milestonesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  milestoneContainer: {
    marginBottom: 8,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  milestoneCheckbox: {
    marginRight: 12,
  },
  checkboxChecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  checkboxUnchecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  milestoneDueDate: {
    fontSize: 12,
  },
  expandIcon: {
    fontSize: 12,
    color: '#999',
  },
  milestoneDetails: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 13,
    lineHeight: 18,
  },
  milestoneLine: {
    height: 2,
    backgroundColor: '#e0e0e0',
    marginLeft: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButton: {
    borderWidth: 2,
    borderColor: '#FF9800',
    backgroundColor: 'transparent',
  },
  completeButton: {
    flex: 1,
  },
  resumeButton: {
    flex: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9800',
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  resumeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  completedBanner: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
});
